import { osmAuth, OSMAuthXHROptions } from 'osm-auth';
import { isBrowser } from '../../../components/helpers';
import {
  PROD_CLIENT_ID,
  TEST_CLIENT_ID,
  TEST_SERVER,
  USE_PROD_API,
} from '../consts';

// TS file in osm-auth is probably broken (new is required)
// @ts-ignore
export const auth = osmAuth({
  redirect_uri: isBrowser() && `${window.location.origin}/oauth-token.html`,
  scope: 'read_prefs write_api write_notes openid',
  auto: true,
  client_id: USE_PROD_API ? PROD_CLIENT_ID : TEST_CLIENT_ID,
  url: USE_PROD_API ? undefined : TEST_SERVER,
  apiUrl: USE_PROD_API ? undefined : TEST_SERVER,
});

export const authFetch = async <T>(options: OSMAuthXHROptions): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    auth.xhr(options, (err: any, details: T) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(details);
    });
  });
