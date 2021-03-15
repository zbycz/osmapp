import { isBrowser } from '../components/helpers';

const cache = {};

const fetchCache = isBrowser()
  ? {
    get: (key) => sessionStorage.getItem(key),
    remove: (key) => sessionStorage.removeItem(key),
    put: (key, value) => sessionStorage.setItem(key, value),
  }
  : {
    get: (key) => cache[key],
    remove: (key) => delete cache[key],
    put: (key, value) => (cache[key] = value),
  };

export const getKey = (url, opts) => url + JSON.stringify(opts);

export const getCache = fetchCache.get;

export const removeFetchCache = (url, opts) => {
  fetchCache.remove(getKey(url, opts));
};

export const writeCacheSafe = (key, value) => {
  try {
    fetchCache.put(key, value);
  } catch (e) {
    console.warn(`Item ${key} was not saved to cache: `, e);
  }
};
