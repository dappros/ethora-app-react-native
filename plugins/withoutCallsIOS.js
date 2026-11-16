const { withInfoPlist } = require('expo/config-plugins');

// iOS counterpart of withoutCallsAndroid. With calls off (EXPO_PUBLIC_VIDEO_CALLS_ENABLED
// is not 'true' at prebuild time) drops the background modes only calls need: `voip`
// (PushKit call pushes) and `audio` (a call kept alive in the background). App Review
// rejects background modes the app has no visible feature for (guideline 2.5.4).
// Without `voip`, modules/ethora-voip also skips PushKit and CallKit at launch.
// Camera and microphone strings stay: photos and voice messages use them.
const CALL_BACKGROUND_MODES = ['audio', 'voip'];

const withoutCallModes = (modes) => {
  if (!Array.isArray(modes)) return modes;
  return modes.filter((mode) => !CALL_BACKGROUND_MODES.includes(mode));
};

module.exports = function withoutCallsIOS(config) {
  if (process.env.EXPO_PUBLIC_VIDEO_CALLS_ENABLED === 'true') return config;

  // Static ios.infoPlist from app.json, so nothing re-adds the modes later
  if (config.ios?.infoPlist?.UIBackgroundModes) {
    config.ios.infoPlist.UIBackgroundModes = withoutCallModes(config.ios.infoPlist.UIBackgroundModes);
  }

  return withInfoPlist(config, (cfg) => {
    const modes = withoutCallModes(cfg.modResults.UIBackgroundModes);
    if (modes && modes.length) cfg.modResults.UIBackgroundModes = modes;
    else delete cfg.modResults.UIBackgroundModes;
    return cfg;
  });
};
