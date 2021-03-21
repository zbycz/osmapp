module.exports = {
  // setupFiles: ['raf/polyfill', './etc/jestSetup.js'],
  // setupFilesAfterEnv: ['<rootDir>/etc/jestSetupFramework.js'],
  // snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts{,x}'],
  testPathIgnorePatterns: ['.next', 'node_modules', 'dist'],
  coverageReporters: ['json', 'lcov', 'text-summary'],
};
