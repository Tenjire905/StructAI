const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Bundle Rive graphics as assets (require('./file.riv')).
if (!config.resolver.assetExts.includes('riv')) {
  config.resolver.assetExts.push('riv');
}

module.exports = config;
