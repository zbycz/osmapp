import { isBrowser } from '../components/helpers';
import { prod } from './helpers';

const cache = {};

const SESSION_STORAGE_CACHE = {
  get: (key: string) => sessionStorage.getItem(key),
  remove: (key: string) => sessionStorage.removeItem(key),
  put: (key: string, value: string) => sessionStorage.setItem(key, value),
  clear: () => sessionStorage.clear(), // this is little dirty, but we use sessionStorage only for this
};

export const LOCAL_STORAGE_CACHE = {
  get: (key: string) => localStorage.getItem(key),
  remove: (key: string) => localStorage.removeItem(key),
  put: (key: string, value: string) => localStorage.setItem(key, value),
  clear: () =>
    Object.keys(localStorage)
      .filter((k) => k.startsWith('http') || k.startsWith('/'))
      .forEach((k) => localStorage.removeItem(k)),
};

const MEMORY_CACHE = {
  get: (key: string) => cache[key],
  remove: (key: string) => delete cache[key],
  put: (key: string, value: string) => {
    cache[key] = value;
  },
  clear: () => {
    Object.keys(cache).forEach((key) => delete cache[key]);
  },
};

const fetchCache =
  global.window?.localStorage.getItem('store_requests_to_local_storage') ===
  'true'
    ? LOCAL_STORAGE_CACHE
    : !prod && isBrowser() // lets leave the sessionStorage cache only for DEV mode
      ? SESSION_STORAGE_CACHE
      : MEMORY_CACHE;

if (fetchCache === LOCAL_STORAGE_CACHE) {
  console.warn('Using store_requests_to_local_storage !!'); // eslint-disable-line no-console
}

export const getKey = (url: string, opts: Record<string, any>) => {
  if (['POST', 'PUT', 'DELETE'].includes(opts.method)) {
    return false;
  }

  return url + JSON.stringify(opts);
};

export const getCache = (key: string | false) => {
  if (key) {
    return fetchCache.get(key); // important: this is string, so we are getting fresh object via JSON.parse() everytime
  }
};

export const removeFetchCache = (
  url: string,
  opts: Record<string, any> = {},
) => {
  const key = getKey(url, opts);
  if (key) {
    fetchCache.remove(key);
  }
};

export const writeCacheSafe = (key: string | false, value: string) => {
  if (!key) return;

  try {
    fetchCache.put(key, value);
  } catch (e) {
    if (e.message.includes('exceeded the quota')) {
      fetchCache.clear();
    }
    console.warn(`Item ${key} was not saved to cache: `, e); // eslint-disable-line no-console
  }
};

export const clearFetchCache = () => {
  fetchCache.clear();
};
