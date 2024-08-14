import nextCookies from 'next-cookies';
import Cookies from 'js-cookie';
import { clearFeatureCache, fetchFeature } from '../../services/osmApi';
import { fetchJson } from '../../services/fetch';
import { isServer } from '../helpers';
import { getCoordsFeature } from '../../services/getCoordsFeature';
import { getApiId, getOsmappLink } from '../../services/helpers';
import { Feature } from '../../services/types';

const DEFAULT_VIEW = [4, 50, 14];

const isLocalhost = (ip) => ['127.0.0.1', '::1'].includes(ip);

const getViewFromIp = async (ip) => {
  try {
    // TODO Currently we dont do rate limiting on our side #83
    // 45 requests per minute from an IP address https://ip-api.com/docs/api:json
    const url = `http://ip-api.com/json/${ip}?fields=status,lat,lon`;
    const { status, lat, lon } = await fetchJson(url);

    if (status === 'success') {
      return lat && lon ? [7, lat, lon] : null;
    }

    return null;
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

const saveLastUrl = (feature: Feature, ctx?) => {
  const url = getOsmappLink(feature);
  if (ctx?.res) {
    ctx.res.setHeader('Set-Cookie', `last-url=${url}; Path=/; Max-Age=86400`);
  } else {
    Cookies.set('last-url', url, { expires: 1, path: '/' });
  }
};

export const getInitialFeature = async (ctx) => {
  const { all, id } = ctx.query;

  // url: /
  if (!all) {
    return null;
  }

  if (all[0].match(/^[-.0-9]+,[-.0-9]+$/)) {
    const [lat, lon] = all[0].split(',');
    const coordsFeature = getCoordsFeature([lon, lat]);
    saveLastUrl(coordsFeature, ctx);
    return coordsFeature;
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
    // (other requests like overpass may be cached)
    clearFeatureCache(getApiId(shortId));
  }

  const t1 = new Date().getTime();

  const initialFeature = await fetchFeature(shortId);
  saveLastUrl(initialFeature, ctx);

  const t2 = new Date().getTime();
  const time = t2 - t1;
  console.log(`getInitialFeature(${shortId}): ${time}ms`); // eslint-disable-line no-console

  return initialFeature;
};
