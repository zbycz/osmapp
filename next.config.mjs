// @ts-check
import { LANGUAGES } from './src/config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  output: process.env.NEXTJS_OUTPUT || undefined,
  env: {
    osmappVersion: process.env.npm_package_version,
    commitHash: (process.env.VERCEL_GIT_COMMIT_SHA || '').substring(0, 7),
    commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || 'dev',
  },
  i18n: {
    locales: ['default', ...Object.keys(LANGUAGES)], // we let next only handle URL, but chosen locale is in getServerIntl()
    defaultLocale: 'default',
    localeDetection: false,
  },
};

export default nextConfig;
