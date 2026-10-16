export type PushDeviceType = 'ios' | 'android';
export type PushTokenType = 'apns' | 'fcm' | 'apns-voip';
export type PushBuildOrigin = 'platform' | 'tenant';

/** Native push token as issued by the OS (APNs hex string on iOS, FCM token on Android). */
export interface NativePushToken {
  token: string;
  deviceType: PushDeviceType;
  tokenType: PushTokenType;
}


export interface RegisterPushTokenPayload {
  registrationToken: string;
  deviceType: PushDeviceType;
  tokenType?: PushTokenType;
  buildOrigin?: PushBuildOrigin;
  /** Encrypted pushes: base64 X25519 public key of this install (`ensurePushKeyPair`). */
  pushKey?: string;
  pushKeyAlg?: 'sealed-box-x25519';
  pushKeyId?: string;
}

/** What we last registered and where — needed to unregister on logout/workspace switch. */
export interface PushRegistrationRecord {
  registrationToken: string;
  /** API domain (cluster) the token was registered on, e.g. `chat.ethora.com`. */
  domain: string;
  appId: string;
  userId: string;
  /** Id of the device key sent with the token; a new key re-registers. */
  pushKeyId?: string;
}
