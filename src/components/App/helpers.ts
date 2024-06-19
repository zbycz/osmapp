import nextCookies from 'next-cookies';
import Cookies from 'js-cookie';
import { getFeatureImage } from '../../services/images';
import { clearFeatureCache, fetchFeature } from '../../services/osmApi';
import { fetchJson } from '../../services/fetch';
import { isServer } from '../helpers';
import { getCoordsFeature } from '../../services/getCoordsFeature';
import { getApiId, getOsmappLink } from '../../services/helpers';
import { Feature } from '../../services/types';
import { captureException } from "../../helpers/sentry";

const DEFAULT_VIEW = [4, 50, 14];

const isLocalhost = (ip) => ['127.0.0.1', '::1'].includes(ip);

const getIpFromRequest = (req) =>
  isLocalhost(req.connection.remoteAddress)
    ? (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    : req.connection.remoteAddress;

const getViewFromIp = async (ip: string | null) => {
  try {
    throw new Error('Sentry test error');


    // TODO Currently we dont do rate limiting on our side #83
    // 45 requests per minute from an IP address https://ip-api.com/docs/api:json
    const url = `http://ip-api.com/json/${ip ?? ''}?fields=status,lat,lon`;
    const { status, lat, lon } = await fetchJson(url);

    if (status === 'success') {
      return lat && lon ? [7, lat, lon] : null;
    }

    return null;
  } catch (e) {
    captureException(e);
    // eslint-disable-next-line no-console
    console.warn('getViewFromIp', e.message ?? e);
    return null;
  }
};

export const getView = async (ctx) => {
  const ip = isServer() ? getIpFromRequest(ctx.req) : null;
  const view = await getViewFromIp(ip);
  return view ?? DEFAULT_VIEW;
};

export const getInitialMapView = async (ctx) => {
  const { mapView } = nextCookies(ctx);
  return mapView ? mapView.split('/') : await getView(ctx);
};

const timeout = (time) =>
  new Promise((resolve) => setTimeout(resolve, time)) as Promise<undefined>;

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
    return coordsFeature; // TODO ssr image ?
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
  saveLastUrl(initialFeature, ctx);

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
