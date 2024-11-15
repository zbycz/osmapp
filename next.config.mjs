// @ts-check
import { withSentryConfig } from '@sentry/nextjs';
import { LANGUAGES } from './src/config.mjs';

const osmappVersion = process.env.npm_package_version;
const commitHash = (process.env.VERCEL_GIT_COMMIT_SHA || '').substring(0, 7);
const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || 'dev';
const sentryRelease = `${osmappVersion}-${commitHash}-${commitMessage.substring(0, 10)}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
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
