const path = require('path');

module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
    babelOptions: {
      configFile: path.resolve(__dirname, 'babel.config.js'),
    },
  },
};
