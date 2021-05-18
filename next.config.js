/* eslint-disable */
const packageJson = require('./package.json');

module.exports = {
  publicRuntimeConfig: {
    osmappVersion: packageJson.version.replace(/\.0$/, ''),
    commitHash: (process.env.VERCEL_GIT_COMMIT_SHA || '').substr(0, 7),
    commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || 'dev',
    languages: { en: 'english', cs: 'česky' },
  },
  webpack: (config, { dev, isServer }) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    if (!dev) {
      config.devtool = 'source-maps';
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
};
