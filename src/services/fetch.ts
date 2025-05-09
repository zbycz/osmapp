import fetch from 'isomorphic-unfetch';
import { getCache, getKey, writeCacheSafe } from './fetchCache';
import { isBrowser } from '../components/helpers';
import { FetchError } from './helpers';

// TODO cancel request in map.on('click', ...)
const abortableQueues: Record<string, AbortController> = {};

export const abortFetch = (queueName: string) => {
  abortableQueues[queueName]?.abort(
    new DOMException(`Aborted by abortFetch(${queueName})`, 'AbortError'),
  );
  delete abortableQueues[queueName];
};

interface FetchOpts extends RequestInit {
  abortableQueueName?: string;
  nocache?: boolean;
}

export const fetchText = async (url: string, opts: FetchOpts = {}) => {
  const key = getKey(url, opts);
  const item = getCache(key); // TODO store promise in the cache to prevent additional request until first one finishes
  if (item) return item;

  const queueName = isBrowser() ? opts?.abortableQueueName : undefined;
  if (queueName) {
    abortableQueues[queueName]?.abort();
    abortableQueues[queueName] = new AbortController();
  }

  try {
    const res = await fetch(url, {
      ...opts,
      signal: abortableQueues[queueName]?.signal,
    });

    if (queueName) {
      delete abortableQueues[queueName];
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
    const noCache =
      opts?.nocache || ['POST', 'PUT', 'DELETE'].includes(opts.method);
    if (!noCache) {
      writeCacheSafe(key, text);
    }
    return text;
  } catch (e) {
    if (isBrowser() && e instanceof DOMException && e.name === 'AbortError') {
      throw e;
    }

    const cause = e?.cause ? ` / cause: ${e.cause}` : '';
    const message = `${e.message}${cause} at ${url}`;
    throw new FetchError(message, e.code || 'network', e.data); // TODO how to tell network error from code exception?
  }
};

export const fetchJson = async <T = any>(url: string, opts: FetchOpts = {}) => {
  const text = await fetchText(url, opts);
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error(
      `fetchJson: parse error: ${e.message}, in "${text?.substr(0, 30)}..."`,
    );
  }
};
