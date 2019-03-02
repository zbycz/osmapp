/* eslint-disable flowtype/require-valid-file-annotation */
module.exports = {
  // setupFiles: ['raf/polyfill', './etc/jestSetup.js'],
  // setupFilesAfterEnv: ['<rootDir>/etc/jestSetupFramework.js'],
  // snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['.next', 'node_modules', 'dist'],
  coverageReporters: ['json', 'lcov', 'text-summary'],
};
