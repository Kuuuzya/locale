const { getDefaultConfig } = require("expo/metro-config");

module.exports = {
  assets: ['./assets/fonts']
};

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
  config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];
  config.resolver.extraNodeModules = {
    "missing-asset-registry-path": require.resolve("react-native/Libraries/Image/AssetRegistry"),
  };
  return config;
})();