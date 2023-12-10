import { isBrowser } from '../components/helpers';

const cache = {};

const fetchCache = isBrowser()
  ? {
      get: (key) => sessionStorage.getItem(key),
      remove: (key) => sessionStorage.removeItem(key),
      put: (key, value) => sessionStorage.setItem(key, value),
      clear: () => sessionStorage.clear(),
    }
  : {
      get: (key) => cache[key],
      remove: (key) => delete cache[key],
      put: (key, value) => {
        cache[key] = value;
      },
      clear: () => {},
    };

export const getKey = (url, opts) => url + JSON.stringify(opts);

export const getCache = fetchCache.get;

export const removeFetchCache = (url, opts = {}) => {
  fetchCache.remove(getKey(url, opts));
};

export const writeCacheSafe = (key, value) => {
  try {
    fetchCache.put(key, value);
  } catch (e) {
    if (e.message.includes('exceeded the quota')) {
      fetchCache.clear();
    }
    console.warn(`Item ${key} was not saved to cache: `, e); // eslint-disable-line no-console
  }
};
