/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  // parser: 'babel-eslint',
  parserOptions: {
    project: './tsconfig.json',
    // ecmaVersion: 7,
    // sourceType: 'module',
    // ecmaFeatures: {
    //   jsx: false,
    //   experimentalObjectRestSpread: true,
    // },
  },
  root: true, // stop ESLint from looking for a configuration file in parent folders
  env: {
    es6: true,
    jest: true,
    node: true,
  },

  extends: ['airbnb-typescript', 'prettier'],

  rules: {
    'react/prop-types': OFF,
    'react/jsx-no-target-blank': OFF,
    'import/prefer-default-export': OFF,
    // 'import/no-default-export': ERROR,
    'jsx-a11y/label-has-associated-control': OFF, // checkbox in <label> was reported
    // "@typescript-eslint/no-unused-vars": OFF,
    // "@typescript-eslint/no-unused-vars-experimental": ERROR,
    'react/require-default-props': OFF,
    'no-nested-ternary': OFF,
    'no-irregular-whitespace': OFF,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};
