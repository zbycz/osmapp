import nextCookies from 'next-cookies';
import { getFeatureImage } from '../../services/images';
import { getFeatureFromApi } from '../../services/osmApi';
import { fetchJson } from '../../services/fetch';

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

export const getInitialMapView = async (ctx, initialFeature) => {
  if (initialFeature) {
    const [lon, lat] = initialFeature.center;
    return [17, lat, lon];
  }
  const { mapView } = nextCookies(ctx);
  return mapView ? mapView.split('/') : getViewFromRequest(ctx.req);
};

const fetchInitialFeature = async (id) => {
  try {
    return id ? await getFeatureFromApi(id) : null;
  } catch (e) {
    return null;
  }
};

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

export const getInititalFeature = async (ctx) => {
  const { osmid, osmtype, id } = ctx.query;
  const shortId =
    osmtype && osmtype.match(/^node|way|relation$/)
      ? osmtype.substr(0, 1) + osmid
      : id;

  const t1 = new Date().getTime();
  const initialFeature = await fetchInitialFeature(shortId);

  const t2 = new Date().getTime();
  const firstRequest = t2 - t1;

  if (initialFeature && firstRequest < 1600) {
    const timeoutIn2Secs = 2000 - firstRequest;
    initialFeature.ssrFeatureImage = await Promise.race([
      timeout(timeoutIn2Secs),
      getFeatureImage(initialFeature),
    ]);
  }

  const t3 = new Date().getTime();

  // eslint-disable-next-line no-console
  console.log(
    `getInititalFeature(${shortId}): ${t2 - t1}ms [osm] + ${t3 - t2}ms [img]`,
  );

  return initialFeature;
};
