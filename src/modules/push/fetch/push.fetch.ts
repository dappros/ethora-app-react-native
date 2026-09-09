import { $api } from '@modules/auth/interceptors';
import { apiBaseUrl } from '@modules/config/utils/workspace';
import { RegisterPushTokenPayload } from '@modules/push/types';

/**
 * POST https://api.[domain]/v1/push/subscription/[appId]
 * Same endpoint the web SDK uses. Authorized with the user's Bearer token
 * (attached by the interceptor). The backend stores the token against the
 * current user and later forwards sends to APNs/FCM directly or via the
 * push gateway, depending on its own configuration — the app doesn't care.
 */
export const registerPushToken = (
  domain: string,
  appId: string,
  payload: RegisterPushTokenPayload
) => $api.post(`/push/subscription/${appId}`, payload, { baseURL: apiBaseUrl(domain) });


export const unregisterPushToken = (domain: string, appId: string, registrationToken: string) =>
  $api.delete(`/push/subscription/${appId}`, {
    baseURL: apiBaseUrl(domain),
    data: { registrationToken },
  });

export const unregisterPushTokenLegacy = (domain: string, registrationToken: string) =>
  $api.delete('/users/endpoints', {
    baseURL: apiBaseUrl(domain),
    data: { endpoint: registrationToken },
  });
