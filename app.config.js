export default ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#121B22',
        image: './assets/CreateInk_logo.png',
        resizeMode: 'contain',
        imageWidth: 160,
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'CreateInk needs photo access to set character portraits.',
      },
    ],
    'expo-sharing',
  ],
  android: {
    ...config.android,
    package: 'com.waengs.createink',
    versionCode: 10,
  },
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.waengs.createink',
    buildNumber: '4',
    infoPlist: {
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
  },
  userInterfaceStyle: 'dark',
  backgroundColor: '#121B22',
});
