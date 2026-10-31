const { withAndroidManifest } = require('expo/config-plugins');

// With calls off (EXPO_PUBLIC_VIDEO_CALLS_ENABLED is not 'true' at prebuild time)
// strips what only calls need from the merged Android manifest: the call
// foreground services and the full-screen-intent permission. Google Play asks
// for a declaration (with a demo video) for each of them, so a build without
// calls must not carry them. Camera and microphone themselves stay: photos and
// voice messages use them.
const CALL_PERMISSIONS = [
  'android.permission.USE_FULL_SCREEN_INTENT',
  'android.permission.FOREGROUND_SERVICE_CAMERA',
  'android.permission.FOREGROUND_SERVICE_MICROPHONE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION',
];

const CALL_SERVICES = [
  // modules/ethora-call-notification: ongoing call, microphone|camera
  'expo.modules.ethoracallnotification.CallNotificationService',
  // react-native-webrtc: screen sharing, mediaProjection
  'com.oney.WebRTCModule.MediaProjectionService',
];

const removeByName = (list, name) => {
  const rest = (list ?? []).filter((item) => item.$['android:name'] !== name);
  rest.push({ $: { 'android:name': name, 'tools:node': 'remove' } });
  return rest;
};

module.exports = function withoutCallsAndroid(config) {
  if (process.env.EXPO_PUBLIC_VIDEO_CALLS_ENABLED === 'true') return config;

  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    for (const name of CALL_PERMISSIONS) {
      manifest['uses-permission'] = removeByName(manifest['uses-permission'], name);
    }

    const app = manifest.application[0];
    for (const name of CALL_SERVICES) {
      app.service = removeByName(app.service, name);
    }
    return cfg;
  });
};
