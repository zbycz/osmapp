// @flow

import fetch from 'isomorphic-unfetch';
import * as xml2js from 'isomorphic-xml2js';

import { isBrowser } from '../components/helpers';
import geojsonExtent from '@mapbox/geojson-extent';

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
