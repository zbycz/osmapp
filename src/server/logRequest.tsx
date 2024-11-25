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
    type: 'event',
    payload: {
      website: process.env.UMAMI_WEBSITE_ID,
      url: ctx.asPath,
      hostname: host,
      language: intl.lang,
      referrer,
      screen: '1280x800',
    },
  };
  const headers = {
    'X-Client-IP': getIp(ctx.req),
    'User-Agent': ctx.req.headers['user-agent'],
  };

  console.log('umami data', JSON.stringify({ data, headers }, null, 2));

  // Promise omitted intentionally
  fetchJson('https://cloud.umami.is/api/send', {
    nocache: true,
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(
    (response) => {
      console.log('umami response', response);
    },
    (error) => {
      console.error('umami error', error);
    },
  );
};
