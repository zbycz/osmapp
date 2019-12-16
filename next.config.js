// @flow

module.exports = {
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
