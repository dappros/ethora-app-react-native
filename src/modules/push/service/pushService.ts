import * as Application from 'expo-application';
import { registerPushToken, unregisterPushToken } from '@modules/push/fetch';
import { pushStorage } from '@modules/push/lib/pushStorage';
import { ensurePushPermission, getNativePushToken } from '@modules/push/service/pushToken';
import { PushEnv, PushRegistrationRecord } from '@modules/push/types';

export interface PushTarget {
  /** API domain (cluster) currently in use, e.g. `chat.ethora.com`. */
  domain: string;
  /** `configApp._id` of the loaded workspace. */
  appId: string;
  /** `user._id` — part of the dedupe key so a user switch re-registers. */
  userId: string;
}

// Debug/dev-client builds get sandbox APNs tokens, TestFlight/App Store get
// production ones. The sender must pick the matching APNs host, so tell it
// which build this token came from. Android doesn't care.
const buildEnv = (): PushEnv => (__DEV__ ? 'development' : 'production');

const sameRegistration = (record: PushRegistrationRecord | null, next: PushRegistrationRecord) =>
  !!record &&
  record.registrationToken === next.registrationToken &&
  record.domain === next.domain &&
  record.appId === next.appId &&
  record.userId === next.userId;

let inFlight: Promise<void> | null = null;

/**
 * Bring the backend registration in line with the current (domain, app, user,
 * native token). Safe to call repeatedly — it no-ops when nothing changed and
 * is single-flight guarded. Never throws.
 */
export const syncPushRegistration = async (target: PushTarget): Promise<void> => {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const granted = await ensurePushPermission();
      if (!granted) return;

      const native = await getNativePushToken();
      if (!native) return;

      const next: PushRegistrationRecord = {
        registrationToken: native.token,
        domain: target.domain,
        appId: target.appId,
        userId: target.userId,
      };

      const current = await pushStorage.get();
      if (sameRegistration(current, next)) return;

      // A stale registration (other domain / user / rotated token) would keep
      // receiving pushes — best effort to remove it first. May 401 when the
      // stored domain is no longer the one our auth token belongs to.
      if (current) {
        await unregisterPushToken(current.domain, current.registrationToken).catch(() => {});
      }

      await registerPushToken(target.domain, target.appId, {
        registrationToken: native.token,
        deviceType: native.deviceType,
        tokenType: native.tokenType,
        bundleId: Application.applicationId ?? '',
        env: buildEnv(),
      });
      await pushStorage.set(next);
      console.log(`[push] registered ${native.tokenType} token on ${target.domain}`);
    } catch (error) {
      console.warn('[push] registration failed; will retry on next app start / login.', error);
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
};

/**
 * Remove the active registration from the backend. Call BEFORE the auth
 * tokens are cleared (the DELETE is authorized with the user's token).
 * Best effort, never throws.
 */
export const dropPushRegistration = async (): Promise<void> => {
  try {
    const record = await pushStorage.get();
    if (!record) return;
    await unregisterPushToken(record.domain, record.registrationToken).catch(() => {});
    await pushStorage.clear();
  } catch {
    // never block logout on push cleanup
  }
};
