export type PushDeviceType = 'ios' | 'android';
export type PushTokenType = 'apns' | 'fcm';
export type PushEnv = 'development' | 'production';

/** Native push token as issued by the OS (APNs hex string on iOS, FCM token on Android). */
export interface NativePushToken {
  token: string;
  deviceType: PushDeviceType;
  tokenType: PushTokenType;
}

/**
 * Body of POST /v1/push/subscription/{appId}.
 * `registrationToken` + `deviceType` is the contract the web SDK already uses;
 * `tokenType`, `bundleId` and `env` are additions for the gateway flow
 * (raw APNs vs FCM, key lookup, sandbox vs production APNs host).
 */
export interface RegisterPushTokenPayload {
  registrationToken: string;
  deviceType: PushDeviceType;
  tokenType: PushTokenType;
  bundleId: string;
  env: PushEnv;
}

/** What we last registered and where — needed to unregister on logout/workspace switch. */
export interface PushRegistrationRecord {
  registrationToken: string;
  /** API domain (cluster) the token was registered on, e.g. `chat.ethora.com`. */
  domain: string;
  appId: string;
  userId: string;
}
