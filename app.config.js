export default ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    'expo-font',
    [
      'expo-image-picker',
      {
        photosPermission:
          'LoreForge needs photo access to set character portraits.',
      },
    ],
    'expo-sharing',
  ],
  android: {
    ...config.android,
    usesCleartextTraffic: true,
  },
  userInterfaceStyle: 'dark',
  backgroundColor: '#121B22',
});
