module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@contexts': './src/contexts',
          '@components': './src/components',
          '@assets': './src/assets',
          '@pages': './src/pages',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@styles': './src/styles',
        },
      },
    ],
  ],
};
