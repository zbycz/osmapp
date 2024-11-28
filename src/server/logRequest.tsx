import type { DocumentContext } from 'next/dist/shared/lib/utils';
import { Intl } from '../services/intl';
import { fetchJson } from '../services/fetch';
import { getIp } from '../components/App/helpers';

// On some days we have 100k of page loads of Vercel Serveless Function.
// Because of that, we had to switch to paid Pro plan from the Hobby.
//
// We need to debug where this traffic comes from to be able to optimize it.

// This function works server-side only to omit any tracking cookies.

export const logRequest = (ctx: DocumentContext, intl: Intl) => {
  const { host, referrer } = ctx.req.headers;
  const data = {
    event: {
      url: ctx.asPath,
      hostname: host,
      language: intl.lang,
      referrer,
      ip: getIp(ctx.req),
      browser: ctx.req.headers['user-agent'],
    },
    sourcetype: 'manual',
    host,
    index: 'main',
  };

  // Promise omitted intentionally
  fetchJson(
    'https://prd-p-a8gkn.splunkcloud.com:8088/services/collector/event',
    {
      nocache: true,
      method: 'POST',
      headers: {
        authorization: 'Splunk 21a3e9e9-9f65-4eee-a18d-02e86aa6374a',
      },
      body: JSON.stringify(data),
    },
  ).then(
    (response) => {
      console.log('logRequest response', response);
    },
    (error) => {
      console.error('logRequest error', error);
    },
  );
};
