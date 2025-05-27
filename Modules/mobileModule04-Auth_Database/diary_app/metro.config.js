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
          if (typeof name === 'string' && name.startsWith('@screens')) {
            return path.join(__dirname, 'src/screens');
          }
          if (typeof name === 'string' && name.startsWith('@services')) {
            return path.join(__dirname, 'src/services');
          }
          if (typeof name === 'string' && name.startsWith('@navigation')) {
            return path.join(__dirname, 'src/navigation');
          }
          if (typeof name === 'string' && name.startsWith('@contexts')) {
            return path.join(__dirname, 'src/contexts');
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
    sourceExts: [
      ...(getDefaultConfig(__dirname).resolver.sourceExts || []),
      'ts',
      'tsx',
      'cjs', // Include CommonJS modules (e.g., Firebase)
      'mjs', // Include ES modules (e.g., Firebase)
    ],
    unstable_enablePackageExports: false, // Disable package exports for compatibility
  },
  // Optional: Watch the aliased folders for changes
  watchFolders: [path.resolve(__dirname, 'src')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
