/* eslint-disable */
const packageJson = require('./package.json');
const withPWA = require('next-pwa')({
  dest: 'public',
});

if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`,
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

const languages = {
  de: 'Deutsch',
  cs: 'Česky',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pl: 'Polski',
  am: 'አማርኛ',
};

module.exports = withPWA({
  output: process.env.NEXTJS_OUTPUT || undefined,
  //TODO fails with current webpack config. Probably needs to get rid of sentry? (@sentry/nextjs was not cool)
  // future: {
  //   webpack5: true,
  // },
  publicRuntimeConfig: {
    osmappVersion: packageJson.version.replace(/\.0$/, ''),
    commitHash: (process.env.VERCEL_GIT_COMMIT_SHA || '').substr(0, 7),
    commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || 'dev',
    languages,
  },
  i18n: {
    // we let next only handle URL, but chosen locale is in getServerIntl()
    locales: ['default', ...Object.keys(languages)],
    defaultLocale: 'default',
    localeDetection: false,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.devtool = 'source-map';
      for (const plugin of config.optimization.minimizer) {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.sourceMap = true;
          break;
        }
      }
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...(isServer ? {} : { '@sentry/node': '@sentry/browser' }),
    };

    return config;
  },
});
