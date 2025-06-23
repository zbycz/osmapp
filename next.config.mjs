// @ts-check
import { withSentryConfig } from '@sentry/nextjs';
import { LANGUAGES } from './src/config.mjs';

const osmappVersion = process.env.npm_package_version;
const commitHash = (process.env.VERCEL_GIT_COMMIT_SHA || '').substring(0, 7);
const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || 'dev';
const sentryRelease = `${osmappVersion}-${commitHash}-${commitMessage.substring(0, 10)}`;

const rewrites = async () => {
  return {
    beforeFiles: [],
    afterFiles: [
      {
        source: '/:coords([-.0-9]+,[-.0-9]+)',
        destination: '/feature/:coords',
      },
      {
        source: '/:shortener([A-Za-z0-9]+[nwr])',
        destination: '/feature/:shortener',
      },
      {
        source: '/node/:path*',
        destination: '/feature/node/:path*',
      },
      {
        source: '/way/:path*',
        destination: '/feature/way/:path*',
      },
      {
        source: '/relation/:path*',
        destination: '/feature/relation/:path*',
      },
    ],
    fallback: [
      // Experiment with static SSR 404:
      //  - On vercel these routing rules are applied before passing the request to backend
      //    This way we can try to optimize number of paid function exectuions and leave pretty urls.
      //  - It works correctly only on Vercel, on dev internal 404 may be rendered.
      //  - WARNING: unfortunately I wasn't able to send HTTP statu 404, so the page just have meta-equiv=noindex
      {
        source: '/:path*',
        destination: `/404.html`,
      },
    ],
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: { position: 'bottom-right' },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  compiler: {
    emotion: true,
  },
  output: process.env.NEXTJS_OUTPUT || undefined,
  env: { osmappVersion, sentryRelease },
  i18n: {
    locales: ['default', ...Object.keys(LANGUAGES)], // we let next only handle URL, but chosen locale is in getServerIntl()
    defaultLocale: 'default',
    localeDetection: false,
  },
  rewrites,
};

export default withSentryConfig(nextConfig, {
  org: 'osmapp', // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  project: 'osmapp',
  silent: !process.env.CI,
  widenClientFileUpload: true, // Upload a larger set of source maps for prettier stack traces (increases build time)
  reactComponentAnnotation: { enabled: true }, // Automatically annotate React components to show their full name in breadcrumbs and session replay
  // tunnelRoute: '/monitoring',
  hideSourceMaps: false,
  disableLogger: true, // Automatically tree-shake Sentry logger statements to reduce bundle size
  automaticVercelMonitors: true, // https://vercel.com/docs/cron-jobs
});
