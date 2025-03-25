import * as Sentry from '@sentry/nextjs';
import nextCookies from 'next-cookies';
import Cookies from 'js-cookie';
import { clearFeatureCache, fetchFeature } from '../../services/osm/osmApi';
import { fetchJson } from '../../services/fetch';
import { isServer } from '../helpers';
import { getCoordsFeature } from '../../services/getCoordsFeature';
import { getOsmappLink, getShortId } from '../../services/helpers';
import { Feature, OsmId } from '../../services/types';
import { View } from '../utils/MapStateContext';
import { NextPageContext } from 'next';

const DEFAULT_VIEW: View = ['4', '50', '14'];

type IpApiResponse = {
  status: string;
  lat: number;
  lon: number;
};

const getViewFromIp = async (ip: string): Promise<View> => {
  try {
    // TODO Currently we dont do rate limiting on our side #83
    // 45 requests per minute from an IP address https://ip-api.com/docs/api:json
    const url = `http://ip-api.com/json/${ip}?fields=status,lat,lon`;
    const { status, lat, lon } = await fetchJson<IpApiResponse>(url);

    if (status === 'success') {
      return lat && lon ? ['7', `${lat}`, `${lon}`] : null;
    }

    return null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('getViewFromIp', e.message ?? e);
    return null;
  }
};

const isLocalhostOrNgnix = (ip: string) => ['127.0.0.1', '::1'].includes(ip);

export const getIp = (req: NextPageContext['req']) => {
  const remoteIp = req.socket.remoteAddress;
  const fwdIp = ((req.headers['x-forwarded-for'] as string) || '') // ngnix: proxy_set_header X-Forwarded-For $remote_addr;
    .split(',')[0]
    .trim();
  return isLocalhostOrNgnix(remoteIp) ? fwdIp : remoteIp;
};

export const getViewFromRequest = async (
  req: NextPageContext['req'],
): Promise<View> => {
  const ip = getIp(req);
  const view = ip ? await getViewFromIp(ip) : null;
  return view ?? DEFAULT_VIEW;
};

export const getInitialMapView = async (
  ctx: NextPageContext,
): Promise<View> => {
  const cookies = nextCookies(ctx);
  const viewCookie = cookies.mapView;
  return viewCookie
    ? (viewCookie.split('/') as View)
    : getViewFromRequest(ctx.req);
};

const saveLastUrl = (feature: Feature, ctx?: NextPageContext) => {
  const url = getOsmappLink(feature);
  if (ctx?.res) {
    ctx.res.setHeader('Set-Cookie', `last-url=${url}; Path=/; Max-Age=86400`);
  } else {
    Cookies.set('last-url', url, { expires: 1, path: '/' });
  }
};

const getValidApiId = (path: string[]): OsmId => {
  const [type, id] = path;
  if (type?.match(/^node|way|relation$/) && id?.match(/^\d+$/)) {
    return { type: path[0], id: parseInt(path[1], 10) } as OsmId;
  }
  return null;
};
export const getInitialFeature = async (
  ctx: NextPageContext,
): Promise<Feature | '404' | null> => {
  // WARNING: The routing from node, way, relation (/node/123),
  // coords feature (/50.1,14.1) and shortener (/xyzn) are matched
  // in next.config.mjs and routed to `/feature/<original-path>` page internally

  if (ctx.pathname !== '/feature/[...all]') {
    return null;
  }

  const path = ctx.query.all as string[];

  // url: "/"
  if (!path) {
    return null;
  }

  if (path[0].match(/^[-.0-9]+,[-.0-9]+$/)) {
    const [lat, lon] = path[0].split(',');
    const coordsFeature = getCoordsFeature([lon, lat]);
    saveLastUrl(coordsFeature, ctx);
    return coordsFeature;
  }

  const apiId = getValidApiId(path);
  if (!apiId) {
    return '404';
  }

  if (isServer()) {
    // we need always fresh OSM element, b/c user can edit a feature and refresh the page
    // (other requests like overpass may be cached)
    clearFeatureCache(apiId);
  }

  const t1 = new Date().getTime();

  const initialFeature = await fetchFeature(apiId);
  saveLastUrl(initialFeature, ctx);

  const t2 = new Date().getTime();
  const time = t2 - t1;
  console.log(`getInitialFeature()`, getShortId(apiId), `${time}ms`); // eslint-disable-line no-console
  Sentry.metrics.distribution('getInitialFeature', time, {
    tags: { ...apiId, ssr: isServer() },
    unit: 'millisecond',
  });

  return initialFeature;
};

export const getMapViewFromHash = (): View | undefined => {
  const view = global.window?.location.hash
    .substring(1)
    .split('/')
    .map(parseFloat) //we want to parse numbers, then serialize back in usePersistMapView()
    .filter((num) => !Number.isNaN(num))
    .map((num) => num.toString());
  return view?.length === 3 ? (view as View) : undefined;
};
