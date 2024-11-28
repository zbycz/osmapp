import type { DocumentContext } from 'next/dist/shared/lib/utils';
import { Intl } from '../services/intl';
import { getIp } from '../components/App/helpers';
import { fetchText } from '../services/fetch';

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
      hostname: host.split(':')[0],
      language: intl.lang,
      referrer,
    },
  };
  const headers = {
    'Content-Type': 'application/json',
    'X-Client-IP': getIp(ctx.req),
    'User-Agent': ctx.req.headers['user-agent'],
  };

  // Promise omitted intentionally, so the app can continue without waiting
  fetchText('https://cloud.umami.is/api/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error('logRequest error', error); // eslint-disable-line no-console
  });
};
