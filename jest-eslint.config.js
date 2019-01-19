// @flow

module.exports = {
  displayName: 'lint',
  verbose: false,
  reporters: ['default'],
  runner: './src/packages/eslint-config-kiwicom/eslint-runner/index.js',
  testMatch: ['<rootDir>/src/**/*.js', '<rootDir>/scripts/**/*.js'],
};
