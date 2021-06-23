import nextCookies from 'next-cookies';
import { getFeatureImage } from '../../services/images';
import { clearFeatureCache, fetchFeature } from '../../services/osmApi';
import { fetchJson } from '../../services/fetch';
import { isServer } from '../helpers';
import { getCoordsFeature } from '../../services/getCoordsFeature';
import { getApiId } from '../../services/helpers';

const DEFAULT_VIEW = [4, 50, 14];

const isLocalhost = (ip) => ['127.0.0.1', '::1'].includes(ip);

const getViewFromIp = async (ip) => {
  try {
    const url = `http://api.ipstack.com/${ip}?access_key=169a541e2e9936a03b0b9e355dd29ff3&format=1`;
    const { latitude: lat, longitude: lon } = await fetchJson(url);
    return lat && lon ? [7, lat, lon] : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('getViewFromIp', e.message ?? e);
    return null;
  }
};

export const getViewFromRequest = async (req) => {
  const remoteIp = req.connection.remoteAddress;
  const fwdIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim(); // ngnix: proxy_set_header X-Forwarded-For $remote_addr;
  const ip = !isLocalhost(remoteIp) ? remoteIp : fwdIp;
  const view = ip ? await getViewFromIp(ip) : null;
  return view ?? DEFAULT_VIEW;
};

export const getInitialMapView = async (ctx) => {
  const { mapView } = nextCookies(ctx);
  return mapView ? mapView.split('/') : getViewFromRequest(ctx.req);
};

const timeout = (time) =>
  new Promise((resolve) => setTimeout(resolve, time)) as Promise<undefined>;

export const getInititalFeature = async (ctx) => {
  const { all, id } = ctx.query;

  // url: /
  if (!all) {
    return null;
  }

  if (all[0].match(/^[-.0-9]+,[-.0-9]+$/)) {
    const [lat, lon] = all[0].split(',');
    return getCoordsFeature([lon, lat]); // TODO ssr image ?
  }

  const [osmtype, osmid] = all;
  const shortId =
    osmtype && osmtype.match(/^node|way|relation$/)
      ? osmtype.substr(0, 1) + osmid
      : id;

  if (!shortId) {
    // TODO 404 when !shortId
    return null;
  }

  if (isServer()) {
    // we need always fresh OSM element, b/c user can edit a feature and refresh the page
    // (other stuff like image or overpass is cached)
    clearFeatureCache(getApiId(shortId));
  }

  const t1 = new Date().getTime();
  const initialFeature = await fetchFeature(shortId);

  const t2 = new Date().getTime();
  const osmRequest = t2 - t1;

  // for SSR try to add image in time limit
  if (initialFeature && isServer() && osmRequest < 1600) {
    const timeoutIn2Secs = 2000 - osmRequest;
    initialFeature.ssrFeatureImage = await Promise.race([
      timeout(timeoutIn2Secs),
      getFeatureImage(initialFeature).catch(() => undefined),
    ]);
  }

  const t3 = new Date().getTime();
  const imageRequest = t3 - t2;

  // eslint-disable-next-line no-console
  console.log(
    `getInititalFeature(${shortId}): ${osmRequest}ms [osm] + ${imageRequest}ms [ssr img]`,
  );

  return initialFeature;
};
