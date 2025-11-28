import { View } from '../utils/MapStateContext';
import { isServer } from '../helpers';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { OSM_USER_COOKIE } from '../../services/osm/consts';
import { getIdFromShortener } from '../../services/shortener';
import { getUrlOsmId } from '../../services/helpers';

const doLangRadirect = () => {
  if (window.location.pathname === '/') {
    if (Cookies.get('lang') && Cookies.get('lang') !== 'en') {
      window.location.href = `/${Cookies.get('lang')}`;
      return true;
    }
  }
};

const doShortenerRedirect = () => {
  const apiId = getIdFromShortener(window.location.pathname.substring(1));

  if (apiId !== null) {
    Router.replace(`/${getUrlOsmId(apiId)}`);
    return true;
  }
};

const doPWARedirect = () => {
  if (window.location.pathname === '/start') {
    const lastUrl = Cookies.get('last-url') || '/';
    Router.replace(lastUrl);
    return true;
  }
};

export const fakeStaticExportStartup = () => {
  if (!process.env.NEXT_PUBLIC_FAKE_STATIC_EXPORT) return;
  if (doLangRadirect()) return;
  if (doShortenerRedirect()) return;
  if (doPWARedirect()) return;

  console.log('FAKE_STATIC_EXPORT used, calling Router.replace()'); // eslint-disable-line no-console
  Router.replace('/').then(() =>
    Router.replace(`${window.location.pathname}${window.location.search}`),
  );
};

export const fakeStaticExportCookies = (cookies: Record<string, string>) => {
  if (!process.env.NEXT_PUBLIC_FAKE_STATIC_EXPORT || isServer()) {
    return cookies;
  }

  const localCookies = Cookies.get(); //we need first render to get browser cookies (formerly they were passed from SSR)
  return {
    ...localCookies,
    [OSM_USER_COOKIE]: JSON.parse(localCookies[OSM_USER_COOKIE] || 'null'),
  };
};

export const fakeStaticExportMapView = (initialMapView: View): View => {
  if (!process.env.NEXT_PUBLIC_FAKE_STATIC_EXPORT || isServer()) {
    return initialMapView;
  }

  const viewCookie = Cookies.get('mapView');
  if (viewCookie) {
    return viewCookie.split('/') as View;
  }

  return initialMapView;
};
