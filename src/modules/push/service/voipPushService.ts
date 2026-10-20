import Constants from 'expo-constants';
import { getVoipToken } from '@/modules/ethora-voip';
import { videoCallsEnabled } from '@modules/chat/config/chatConfig';
import { registerPushToken, unregisterPushToken } from '@modules/push/fetch';
import { voipPushStorage } from '@modules/push/lib/pushStorage';
import type { PushTarget } from '@modules/push/service/pushService';
import { PushBuildOrigin, PushRegistrationRecord } from '@modules/push/types';

// iOS VoIP (PushKit) token, registered as `apns-voip` next to the device's
// APNs token. The service sends it nothing but incoming calls, as VoIP
// pushes: those wake even a killed app, which reports the call to CallKit
// natively (modules/ethora-voip). Only while calls are on in this build —
// a VoIP push nobody can answer still rings the CallKit screen.

const buildOrigin = (): PushBuildOrigin =>
  Constants.expoConfig?.extra?.push?.buildOrigin === 'tenant' ? 'tenant' : 'platform';

const sameRegistration = (record: PushRegistrationRecord | null, next: PushRegistrationRecord) =>
  !!record &&
  record.registrationToken === next.registrationToken &&
  record.domain === next.domain &&
  record.appId === next.appId &&
  record.userId === next.userId;

const drop = async (record: PushRegistrationRecord, noRefresh?: boolean): Promise<void> => {
  try {
    await unregisterPushToken(record.domain, record.appId, record.registrationToken, noRefresh);
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status !== 404) {
      console.warn(`[push] could not drop the VoIP registration on ${record.domain}`, status ?? '');
    }
  }
  await voipPushStorage.clear();
};

let inFlight: Promise<void> | null = null;

/**
 * Bring the backend's VoIP registration in line with the current (domain,
 * app, user, PushKit token). Same contract as syncPushRegistration:
 * idempotent, single-flight, never throws. No-op off iOS.
 */
export const syncVoipRegistration = async (target: PushTarget): Promise<void> => {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const current = await voipPushStorage.get();
      if (!videoCallsEnabled) {
        // Calls switched off in this build: stop the VoIP pushes.
        if (current) await drop(current, true);
        return;
      }
      // PushKit issues the token a moment after launch; the token listener
      // calls this again then.
      const token = getVoipToken();
      if (!token) return;

      const next: PushRegistrationRecord = {
        registrationToken: token,
        domain: target.domain,
        appId: target.appId,
        userId: target.userId,
      };
      if (sameRegistration(current, next)) return;
      if (current) await drop(current, true);

      // No fallback to the legacy contract here: a backend that does not
      // know `tokenType` would store the PushKit token as an FCM one.
      await registerPushToken(target.domain, target.appId, {
        registrationToken: token,
        deviceType: 'ios',
        tokenType: 'apns-voip',
        buildOrigin: buildOrigin(),
      });
      await voipPushStorage.set(next);
      console.log(`[push] registered apns-voip token (${buildOrigin()}) on ${target.domain}`);
      if (__DEV__) console.log('[push] apns-voip token:', token);
    } catch (error) {
      const response = (error as { response?: { status?: number; data?: unknown } })?.response;
      console.warn(
        '[push] VoIP registration failed; will retry on next app start / login.',
        response?.status ?? '',
        response?.data ? JSON.stringify(response.data) : error
      );
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
};

/** Remove the VoIP registration (logout). Best effort, never throws. */
export const dropVoipRegistration = async (): Promise<void> => {
  try {
    const record = await voipPushStorage.get();
    if (record) await drop(record);
  } catch {
    // never block logout on push cleanup
  }
};
