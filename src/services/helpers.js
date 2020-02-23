// @flow

import fetch from 'isomorphic-unfetch';
import * as xml2js from 'isomorphic-xml2js';

import { isBrowser } from '../components/helpers';
import geojsonExtent from '@mapbox/geojson-extent';
import nextCookies from 'next-cookies';
import { getFeatureImage } from './images';
import { getFeatureFromApi } from './osmApi';

// TOOD cancel request in map.on('click', ...)
const noRequestRunning = { abort: () => {} };
let abortController = noRequestRunning;

const cache = {};
const getKey = (url, opts) => url + JSON.stringify(opts);
const getCache = key =>
  isBrowser() ? sessionStorage.getItem(key) : cache[key];
const removeCache = key =>
  isBrowser() ? sessionStorage.removeItem(key) : delete cache[key];
const writeCache = (key, value) =>
  isBrowser() ? sessionStorage.setItem(key, value) : (cache[key] = value);
export const removeFetchCache = (url, opts) => removeCache(getKey(url, opts));

export const fetchText = async (url, opts) => {
  let key = getKey(url, opts);
  const item = getCache(key);
  if (item) return item;

  if (isBrowser() && opts?.putInAbortableQueue) {
    abortController.abort();
    abortController = new AbortController();
  }

  const res = await fetch(url, {
    ...opts,
    signal: abortController.signal,
  });

  abortController = noRequestRunning;

  // TODO ajax spinner ?

  if (!res.ok || res.status < 200 || res.status >= 300) {
    const data = await res.text();
    throw new Error(
      `Fetch: ${res.status} ${res.statusText} ${res.url} Data: ${data}`,
    );
  }

  const text = await res.text();
  if (!opts || !opts.nocache) {
    writeCache(key, text);
  }
  return text;
};

export const fetchJson = async (url, opts) =>
  JSON.parse(await fetchText(url, opts));

export const parseXmlString = (xml, opts) => {
  const parser = new xml2js.Parser(
    opts || {
      explicitArray: false,
      explicitCharkey: false,
      explicitRoot: false,
    },
  );

  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// apiId.replace(/([a-z])[a-z]+\/([0-9]+)/, '$1$2');
export const getShortId = apiId => {
  return apiId.type[0] + apiId.id;
};

export const getApiId = value => {
  if (value.type && value.id) {
    return value;
  }

  const shortId = value;
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]];
  const id = shortId.substr(1);
  return { type, id };
};

export const getShortLink = apiId =>
  `https://osmap.cz/${apiId.type}/${apiId.id}`;

export const getCenter = feature => {
  const type = feature.geometry.type;

  // node
  if (!type || type === 'Point') {
    return feature.geometry.coordinates;
  }

  // relation
  if (type !== 'LineString' && type !== 'Polygon') {
    console.warn('Error: Unknown geometry', type, feature);
    return undefined;
  }

  // way
  try {
    const ex = geojsonExtent(feature); // [WSEN]
    const avg = (a, b) => (a + b) / 2; // flat earth rulezz
    const lon = avg(ex[0], ex[2]);
    const lat = avg(ex[1], ex[3]);
    return [lon, lat];
  } catch (e) {
    console.warn('Error: Unknown center of geojson', e, feature);
    return undefined;
  }
};

export const prod = process.env.NODE_ENV === 'production';

const defaultView = [4, 50, 14];
const isLocalhost = ip => ['127.0.0.1', '::1'].includes(ip);

export const getViewFromIP = async ({ req }) => {
  const rmtIp = req.connection.remoteAddress;
  const fwdIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim(); // ngnix: proxy_set_header X-Forwarded-For $remote_addr;
  const ip = rmtIp && !isLocalhost(rmtIp) ? rmtIp : fwdIp;
  const url = `http://api.ipstack.com/${ip}?access_key=169a541e2e9936a03b0b9e355dd29ff3&format=1`;

  try {
    const { latitude: lat, longitude: lon } = await fetchJson(url);
    return lat && lon ? [7, lat, lon] : defaultView;
  } catch (e) {
    console.warn('getViewFromIP', e);
    return defaultView;
  }
};

export const getInitialMapState = async ctx => {
  const { mapView } = nextCookies(ctx);
  return mapView ? mapView.split('/') : await getViewFromIP(ctx);
};

const fetchInitialFeature = async id => {
  try {
    return id ? await getFeatureFromApi(id) : null;
  } catch (e) {
    return null;
  }
};

export const getInititalFeature = async ctx => {
  const { lastFeatureId } = nextCookies(ctx);
  const shortId = ctx.query.id || lastFeatureId;

  const t1 = new Date();
  const initialFeature = await fetchInitialFeature(shortId);

  const t2 = new Date();
  if (initialFeature) {
    initialFeature.ssrFeatureImage = await getFeatureImage(initialFeature);
  }

  const t3 = new Date();
  console.log(`getInititalFeature(${shortId}): ${t2 - t1}ms [osm] + ${t3 - t2}ms [img]`);

  return initialFeature;
};
