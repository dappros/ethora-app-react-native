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

/**
 * DELETE https://api.[domain]/v1/users/endpoints — removes the device token.
 * Must be sent to the domain the token was registered on (which after a
 * workspace switch is not the current one), hence the explicit baseURL.
 */
export const unregisterPushToken = (domain: string, registrationToken: string) =>
  $api.delete('/users/endpoints', {
    baseURL: apiBaseUrl(domain),
    data: { endpoint: registrationToken },
  });
