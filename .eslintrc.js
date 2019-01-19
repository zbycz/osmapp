const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
      experimentalObjectRestSpread: true,
    },
  },
  root: true, // stop ESLint from looking for a configuration file in parent folders
  env: {
    es6: true,
    jest: true,
    node: true,
  },

  extends: ['@kiwicom/eslint-config'],

  rules: {
    'no-process-env': ERROR,
    'no-restricted-imports': [
      ERROR,
      {
        paths: [
          {
            name: 'graphql-relay',
            // TODO: eventually just disallow it completely
            importNames: [
              'fromGlobalId', // @kiwicom/graphql-global-id
              'toGlobalId',
              'connectionArgs', // @kiwicom/graphql-utils
              'connectionDefinitions',
              'connectionFromArray',
              'connectionFromArraySlice',
              'connectionFromPromisedArray',
              'connectionFromPromisedArraySlice',
            ],
          },
        ],
      },
    ],
    'import/no-extraneous-dependencies': [
      ERROR,
      {
        devDependencies: ['/scripts/**', '**/*.test.js', '**/*.spec.js'],
      },
    ],
    'dependencies/no-cycles': WARN, // cycles are sometimes expected in GraphQL
    'react/jsx-no-bind': OFF, // https://reactjs.org/docs/hooks-faq.html#are-hooks-slow-because-of-creating-functions-in-render

    // Possible future of @kiwicom/eslint-config:
    'jest/prefer-to-be-null': ERROR,
    'jest/prefer-to-be-undefined': ERROR,
    'jest/prefer-to-contain': ERROR,
    'jest/prefer-to-have-length': ERROR,
  },

  overrides: [
    {
      files: ['scripts/**/*.js', 'src/packages/**/*.js'],
      rules: {
        // It's expected to access process.env in our NPM packages or scrips.
        'no-process-env': OFF,
      },
    },
  ],
};
