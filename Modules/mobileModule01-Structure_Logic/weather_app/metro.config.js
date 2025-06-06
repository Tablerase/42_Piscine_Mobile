const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          // Redirect @alias imports to the correct path
          if (typeof name === 'string' && name.startsWith('@pages')) {
            return path.join(__dirname, 'src/pages');
          }
          if (typeof name === 'string' && name.startsWith('@components')) {
            return path.join(__dirname, 'src/components');
          }
          if (typeof name === 'string' && name.startsWith('@assets')) {
            // Note: assets might need different handling depending on usage
            return path.join(__dirname, 'src/assets');
          }
          if (typeof name === 'string' && name.startsWith('@hooks')) {
            return path.join(__dirname, 'src/hooks');
          }
          if (typeof name === 'string' && name.startsWith('@utils')) {
            return path.join(__dirname, 'src/utils');
          }
          if (typeof name === 'string' && name.startsWith('@styles')) {
            return path.join(__dirname, 'src/styles');
          }
          // Fallback to default node module resolution
          return path.join(__dirname, `node_modules/${name}`);
        },
      },
    ),
    // Add 'ts' and 'tsx' to sourceExts if not already present
    sourceExts: [
      ...(getDefaultConfig(__dirname).resolver.sourceExts || []),
      'ts',
      'tsx',
    ],
  },
  // Optional: Watch the aliased folders for changes
  watchFolders: [path.resolve(__dirname, 'src')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
