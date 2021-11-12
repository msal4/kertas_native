export default {
  name: "Kertas",
  slug: "kertas-school",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "iq.kertas.school",
    buildNumber: "1.0.1",
    supportsTablet: true,
    usesIcloudStorage: true,
  },
  android: {
    package: "iq.kertas.school",
    versionCode: 2,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    graphqlURL: process.env.GRAPHQL_URL,
    cdnURL: process.env.CDN_URL,
  },
  plugins: [
    "expo-image-picker",
    {
      photosPermission: "Access user photos for uploading assignments and sharing them in chat.",
      cameraPermision: "Take photos for uploading assignments and sharing them in chat.",
    },
  ],
};
