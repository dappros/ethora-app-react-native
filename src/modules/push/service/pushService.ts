import Constants from 'expo-constants';
import {
  registerPushToken,
  unregisterPushToken,
  unregisterPushTokenLegacy,
} from '@modules/push/fetch';
import { pushStorage } from '@modules/push/lib/pushStorage';
import { ensurePushPermission, getNativePushToken } from '@modules/push/service/pushToken';
import { PushBuildOrigin, PushRegistrationRecord, RegisterPushTokenPayload } from '@modules/push/types';

export interface PushTarget {
  /** API domain (cluster) currently in use, e.g. `chat.ethora.com`. */
  domain: string;
  /** `configApp._id` of the loaded workspace. */
  appId: string;
  /** `user._id` — part of the dedupe key so a user switch re-registers. */
  userId: string;
}

const buildOrigin = (): PushBuildOrigin =>
  Constants.expoConfig?.extra?.push?.buildOrigin === 'tenant' ? 'tenant' : 'platform';

const sameRegistration = (record: PushRegistrationRecord | null, next: PushRegistrationRecord) =>
  !!record &&
  record.registrationToken === next.registrationToken &&
  record.domain === next.domain &&
  record.appId === next.appId &&
  record.userId === next.userId;

let inFlight: Promise<void> | null = null;

const unregister = async (record: PushRegistrationRecord): Promise<void> => {
  try {
    await unregisterPushToken(record.domain, record.appId, record.registrationToken);
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status !== 404) throw error;
    await unregisterPushTokenLegacy(record.domain, record.registrationToken);
  }
};

const isUnknownFieldError = (error: unknown): boolean => {
  const response = (error as { response?: { status?: number; data?: { error?: string } } })
    ?.response;
  return response?.status === 422 && /not allowed/i.test(String(response.data?.error ?? ''));
};

const registerWithFallback = async (
  target: PushTarget,
  payload: RegisterPushTokenPayload
): Promise<'new' | 'legacy'> => {
  try {
    await registerPushToken(target.domain, target.appId, payload);
    return 'new';
  } catch (error) {
    if (!isUnknownFieldError(error)) throw error;
    await registerPushToken(target.domain, target.appId, {
      registrationToken: payload.registrationToken,
      deviceType: payload.deviceType,
    });
    return 'legacy';
  }
};

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


      const contract = await registerWithFallback(target, {
        registrationToken: native.token,
        deviceType: native.deviceType,
        tokenType: native.tokenType,
        buildOrigin: buildOrigin(),
      });
      await pushStorage.set(next);
      console.log(
        `[push] registered ${native.tokenType} token (${buildOrigin()}, ${contract} contract) on ${target.domain}`
      );
    } catch (error) {
      const response = (error as { response?: { status?: number; data?: unknown } })?.response;
      console.warn(
        '[push] registration failed; will retry on next app start / login.',
        response?.status ?? '',
        response?.data ? JSON.stringify(response.data) : error
      );
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
    await unregister(record).catch(() => {});
    await pushStorage.clear();
  } catch {
    // never block logout on push cleanup
  }
};
