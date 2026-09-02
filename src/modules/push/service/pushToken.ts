import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NativePushToken } from '@modules/push/types';

let warnedOnce = false;
const warn = (message: string, error?: unknown) => {
  if (warnedOnce) return;
  warnedOnce = true;
  console.warn(`[push] ${message}`, error ?? '');
};

/**
 * Ask for the OS notification permission (handles iOS alerts and Android 13+
 * POST_NOTIFICATIONS). Returns true when notifications may be shown.
 */
export const ensurePushPermission = async (): Promise<boolean> => {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
};

/**
 * Native device push token:
 *  - iOS: raw APNs token (hex string) — no Firebase involved;
 *  - Android: FCM registration token (needs google-services.json in the build).
 * Returns null where push simply cannot work (iOS Simulator, missing FCM
 * config) instead of throwing — the app must run fine without push.
 */
export const getNativePushToken = async (): Promise<NativePushToken | null> => {
  if (Platform.OS === 'ios' && !Device.isDevice) {
    warn('iOS Simulator cannot receive remote pushes; skipping registration.');
    return null;
  }

  try {
    const devicePushToken = await Notifications.getDevicePushTokenAsync();
    const token = typeof devicePushToken.data === 'string' ? devicePushToken.data : '';
    if (!token) return null;

    return Platform.OS === 'ios'
      ? { token, deviceType: 'ios', tokenType: 'apns' }
      : { token, deviceType: 'android', tokenType: 'fcm' };
  } catch (error) {
    // Most common: Android build without google-services.json, or missing
    // aps-environment entitlement on iOS. The app works without push.
    warn('Could not obtain a device push token; app continues without push.', error);
    return null;
  }
};
