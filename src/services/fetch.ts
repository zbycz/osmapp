import fetch from 'isomorphic-unfetch';
import { getCache, getKey, writeCacheSafe } from './fetchCache';
import { isBrowser } from '../components/helpers';

export class FetchError extends Error {
  constructor(
    public message: string = '',
    public code: string,
    public data: string,
  ) {
    super();
  }

  toString() {
    const suffix = this.data && ` Data: ${this.data.substring(0, 1000)}`;
    return `Fetch: ${this.message}${suffix}`;
  }
}

// TODO cancel request in map.on('click', ...)
const noRequestRunning = {
  abort: () => {},
  signal: null,
};
let abortController = noRequestRunning;

interface FetchOpts extends RequestInit {
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

  try {
    const res = await fetch(url, {
      ...opts,
      signal: abortController.signal,
    });

    abortController = noRequestRunning;

    if (!res.ok || res.status < 200 || res.status >= 300) {
      const data = await res.text();
      throw new FetchError(
        `${res.status} ${res.statusText}`,
        `${res.status}`,
        data,
      );
    }

    const text = await res.text();
    if (!opts || !opts.nocache) {
      writeCacheSafe(key, text);
    }
    return text;
  } catch (e) {
    throw new FetchError(`${e.message} at ${url}`, e.code || 'network', e.data); // TODO how to tell network error from code exception?
  }
};

export const fetchJson = async (url, opts = {}) => {
  const text = await fetchText(url, opts);
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`fetchJson: ${e.message}, in "${text?.substr(0, 30)}..."`);
  }
};
