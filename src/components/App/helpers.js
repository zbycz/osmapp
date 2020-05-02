import { getFeatureImage } from '../../services/images';
import { getFeatureFromApi } from '../../services/osmApi';
import nextCookies from 'next-cookies';
import { fetchJson } from '../../services/helpers';

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

export const getInitialMapState = async (ctx, initialFeature) => {
  if (initialFeature) {
    const [lon, lat] = initialFeature.center;
    return [17, lat, lon];
  }
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

const timeout = time => new Promise(resolve => setTimeout(resolve, time));

export const getInititalFeature = async ctx => {
  const shortId = ctx.query.id;

  const t1 = new Date();
  const initialFeature = await fetchInitialFeature(shortId);

  const t2 = new Date();
  const firstRequest = t2 - t1;

  if (initialFeature && firstRequest < 1600) {
    const timeoutIn2Secs = 2000 - firstRequest;
    initialFeature.ssrFeatureImage = await Promise.race([
      timeout(timeoutIn2Secs),
      getFeatureImage(initialFeature),
    ]);
  }

  const t3 = new Date();
  console.log(
    `getInititalFeature(${shortId}): ${t2 - t1}ms [osm] + ${t3 - t2}ms [img]`,
  );

  return initialFeature;
};
