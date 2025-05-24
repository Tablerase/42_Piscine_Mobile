module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
          '.png',
          '.jpg',
          '.jpeg',
        ],
        alias: {
          '@services': './src/services',
          '@navigation': './src/navigation',
          '@contexts/*': ['./src/contexts/*'],
          '@components': './src/components',
          '@assets': './src/assets',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@styles': './src/styles',
        },
      },
    ],
  ],
};
