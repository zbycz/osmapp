import fetch from 'isomorphic-unfetch';
import { getCache, getKey, writeCacheSafe } from './fetchCache';
import { isBrowser } from '../components/helpers';
import { FetchError } from './helpers';

// TODO cancel request in map.on('click', ...)
const abortableQueues: Record<string, AbortController> = {};

export const abortFetch = (abortableQueueName: string) => {
  abortableQueues[abortableQueueName]?.abort();
  delete abortableQueues[abortableQueueName];
};

interface FetchOpts extends RequestInit {
  abortableQueueName?: string;
  nocache?: boolean;
}

export const fetchText = async (url, opts: FetchOpts = {}) => {
  const key = getKey(url, opts);
  const item = getCache(key);
  if (item) return item;

  const name = isBrowser() ? opts?.abortableQueueName : undefined;
  if (name) {
    abortableQueues[name]?.abort();
    abortableQueues[name] = new AbortController();
  }

  try {
    const res = await fetch(url, {
      ...opts,
      signal: abortableQueues[name]?.signal,
    });

    if (name) {
      delete abortableQueues[name];
    }

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
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw e;
    }

    throw new FetchError(`${e.message} at ${url}`, e.code || 'network', e.data); // TODO how to tell network error from code exception?
  }
};

export const fetchJson = async (url, opts: FetchOpts = {}) => {
  const text = await fetchText(url, opts);
  try {
    return JSON.parse(text);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw e;
    }

    throw new Error(`fetchJson: ${e.message}, in "${text?.substr(0, 30)}..."`);
  }
};
