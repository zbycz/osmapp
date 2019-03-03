// @flow

import fetch from 'isomorphic-unfetch';
import * as xml2js from 'isomorphic-xml2js';
import { isBrowser } from '../components/helpers';

const noRequestRunning = { abort: () => {} };
let abortController = noRequestRunning;

export const fetchText = async (url, opts) => {
  if (isBrowser() && opts.putInAbortableQueue) {
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
    throw new Error(
      `Fetch: ${res.status} ${res.statusText} ${res.url} Data: ${data}`,
    );
  }

  return res.text();
};

export const parseXmlString = (xml, opts) => {
  const parser = new xml2js.Parser(
    opts || {
      explicitArray: false,
      explicitCharkey: false,
      explicitRoot: false,
    },
  );

  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const getShortId = apiId => {
  if (typeof apiId === 'string') {
    return apiId.replace(/([a-z])[a-z]+\/([0-9]+)/, '$1$2');
  }
  return apiId.type[0] + apiId.id;
};

export const getApiId = shortId => {
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]];
  const id = shortId.substr(1);
  return { type, id };
};
