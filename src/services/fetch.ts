import fetch from 'isomorphic-unfetch';
import { getCache, getKey, writeCacheSafe } from './fetchCache';
import { isBrowser } from '../components/helpers';

class ApiError extends Error {
  public code: number;
}

// TODO cancel request in map.on('click', ...)
const noRequestRunning = {
  abort: () => {},
  signal: null,
};
let abortController = noRequestRunning;

interface FetchOpts {
  putInAbortableQueue?: boolean;
  nocache?: boolean;
}

export const fetchText = async (url, opts: FetchOpts = {}) => {
  const key = getKey(url, opts);
  const item = getCache(key);
  if (item) return item;

  if (isBrowser() && opts?.putInAbortableQueue) {
    abortController.abort();
    abortController = new AbortController();
  }

  const res = await fetch(url, {
    ...opts,
    signal: abortController.signal,
  });

  abortController = noRequestRunning;

  // TODO ajax spinner ?

  if (!res.ok || res.status < 200 || res.status >= 300) {
    const data = await res.text();
    const error = new ApiError(
      `Fetch: ${res.status} ${res.statusText} ${res.url} Data: ${data}`,
    );
    error.code = res.status;
    throw error;
  }

  const text = await res.text();
  if (!opts || !opts.nocache) {
    writeCacheSafe(key, text);
  }
  return text;
};

export const fetchJson = async (url, opts = {}) => {
  const text = await fetchText(url, opts);
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`fetchJson: ${e.message}, in "${text?.substr(0, 30)}..."`);
  }
};
