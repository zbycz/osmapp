import * as Sentry from '@sentry/node'; // in browser aliased to @sentry/browser (next.config.js)
// import Cookie from 'js-cookie';

export const initSentry = () => {
  Sentry.init({
    dsn: 'https://79cd9dbaeb0f4d0f868e2d4574f8b7e2@sentry.io/1858591',
    release: process.env.SENTRY_RELEASE ?? 'dev',
    maxBreadcrumbs: 50,
    attachStacktrace: true,
  });
};

export const captureException = (err, errorInfo) => {
  Sentry.configureScope((scope) => {
    if (err.message) {
      // De-duplication currently doesn't work correctly for SSR / browser errors
      // so we force deduplication by error message if it is present
      scope.setFingerprint([err.message]);
    }

    if (process.browser) {
      scope.setTag('ssr', false);

      const visitorId = ''; // Cookie.get('OSMID');
      if (visitorId) {
        scope.setUser({ id: visitorId });
      }
    } else {
      scope.setTag('ssr', true);
    }

    if (errorInfo) {
      scope.setExtra('componentStack', errorInfo.componentStack);
    }
  });

  Sentry.captureException(err);
};
