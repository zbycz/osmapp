import * as Sentry from '@sentry/node'; // in browser aliased to @sentry/browser (next.config.js)
import getConfig from 'next/config';

export const initSentry = () => {
  const {
    publicRuntimeConfig: { osmappVersion, commitHash, commitMessage },
  } = getConfig();

  Sentry.init({
    dsn: 'https://79cd9dbaeb0f4d0f868e2d4574f8b7e2@sentry.io/1858591',
    environment: process.env.VERCEL_ENV || 'development',
    release: `${osmappVersion}-${commitHash}-${commitMessage.substr(0, 10)}`,
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    // @ts-ignore
    autoSessionTracking: false, // lots of type:session events https://forum.sentry.io/t/understanding-the-events-sent-by-the-js-sdk-type-session/13606
  });
};

export const captureException = (err, errorInfo?) => {
  Sentry.configureScope((scope) => {
    if (err.message) {
      // De-duplication currently doesn't work correctly for SSR / browser errors
      // so we force deduplication by error message if it is present
      scope.setFingerprint([err.message]);
    }

    if (process.browser) {
      scope.setTag('ssr', false);
      // scope.setUser({ id: visitorId });
    } else {
      scope.setTag('ssr', true);
    }

    if (errorInfo) {
      scope.setExtra('componentStack', errorInfo.componentStack);
    }
  });

  Sentry.captureException(err);
};
