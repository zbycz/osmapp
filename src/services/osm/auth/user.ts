import { auth, authFetch } from './authFetch';
import Cookies from 'js-cookie';
import { OSM_TOKEN_COOKIE, OSM_USER_COOKIE } from '../consts';

export type OsmUser = {
  name: string;
  imageUrl: string;
};

export const fetchOsmUser = async (): Promise<OsmUser> => {
  const response = await authFetch<string>({
    method: 'GET',
    path: '/api/0.6/user/details.json',
  });
  const details = JSON.parse(response).user;
  return {
    name: details.display_name,
    imageUrl:
      details.img?.href ??
      `https://www.gravatar.com/avatar/${details.id}?s=24&d=robohash`,
  };
};

export const loginAndfetchOsmUser = async (): Promise<OsmUser> => {
  const osmUser = await fetchOsmUser();

  const { url } = auth.options();
  const accessToken = localStorage.getItem(`${url}oauth2_access_token`);
  const osmUserForSSR = JSON.stringify(osmUser);
  Cookies.set(OSM_TOKEN_COOKIE, accessToken, { path: '/', expires: 365 });
  Cookies.set(OSM_USER_COOKIE, osmUserForSSR, { path: '/', expires: 365 });

  return osmUser;
};

export const osmLogout = async () => {
  auth.logout();
  Cookies.remove(OSM_TOKEN_COOKIE, { path: '/' });
  Cookies.remove(OSM_USER_COOKIE, { path: '/' });
};
