export const USE_PROD_API = !process.env.NEXT_PUBLIC_ENABLE_TEST_API;

export const TEST_SERVER = 'https://master.apis.dev.openstreetmap.org';
export const PROD_SERVER = 'https://api.openstreetmap.org';
export const OSM_WEBSITE = USE_PROD_API
  ? 'https://www.openstreetmap.org'
  : TEST_SERVER;

export const API_SERVER = USE_PROD_API ? PROD_SERVER : TEST_SERVER;

export const PROD_CLIENT_ID = process.env.NEXT_PUBLIC_OSM_CLIENT_ID;
export const TEST_CLIENT_ID = 'a_f_aB7ADY_kdwe4YHpmCSBtNtDZ-BitW8m5I6ijDwI';

export const OSM_USER_COOKIE = USE_PROD_API
  ? 'osmUserForSSR'
  : 'osmUserForSSR_TESTAPI';

export const OSM_TOKEN_COOKIE = USE_PROD_API
  ? 'osmAccessToken'
  : 'osmAccessToken_TESTAPI';
