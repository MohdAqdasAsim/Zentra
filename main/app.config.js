export default {
  expo: {
    name: "Zentra",
    slug: "zentra",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon.png",
    scheme: "zentra",
    deepLinking: true,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mohdaqdasasim.zentra",
    },

    android: {
      package: "com.mohdaqdasasim.zentra",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.mohdaqdasasim.zentra",
      adaptiveIcon: {
        foregroundImage: "./assets/images/app-icon.png",
        backgroundColor: "#ffffff",
      },
      splash: {
        image: "./assets/images/icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      intentFilters: [
        {
          autoVerify: true,
          action: "VIEW",
          data: {
            scheme: "https",
            host: "zentra.app",
          },
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/app-icon.png",
    },

    plugins: ["expo-router"],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      BACKEND_TOKEN: process.env.BACKEND_TOKEN,
      BACKEND_URL: process.env.BACKEND_URL,
    },
  },
};
