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

  extends: ['airbnb-typescript'],

};
