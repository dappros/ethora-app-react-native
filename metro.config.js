const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

let config = getDefaultConfig(__dirname);

// Try to load nativewind/metro, but don't fail if it's not available during EAS Build
try {
  const { withNativeWind } = require('nativewind/metro');
  const cssPath = path.resolve(__dirname, './global.css');
  config = withNativeWind(config, { input: cssPath });
} catch (error) {
  console.warn('Warning: Could not load nativewind/metro:', error.message);
  // Continue with default config
}

module.exports = config;
