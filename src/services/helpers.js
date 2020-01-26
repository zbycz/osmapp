// @flow

import fetch from 'isomorphic-unfetch';
import * as xml2js from 'isomorphic-xml2js';

import { isBrowser } from '../components/helpers';

// TOOD cancel request in map.on('click', ...)
const noRequestRunning = { abort: () => {} };
let abortController = noRequestRunning;

export const fetchText = async (url, opts) => {
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

// apiId.replace(/([a-z])[a-z]+\/([0-9]+)/, '$1$2');
export const getShortId = apiId => {
  return apiId.type[0] + apiId.id;
};

export const getApiId = value => {
  if (value.type && value.id) {
    return value;
  }

  const shortId = value;
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]];
  const id = shortId.substr(1);
  return { type, id };
};

export const getShortLink = apiId =>
  `https://osmap.cz/${apiId.type}/${apiId.id}`;
