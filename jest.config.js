module.exports = {
  globalSetup: '<rootDir>/jest.globalSetup.js',
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts{,x}'],
  testPathIgnorePatterns: ['.next', 'node_modules', 'dist'],
  coverageReporters: ['json', 'lcov', 'text-summary'],
};
