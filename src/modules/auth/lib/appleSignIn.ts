import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

/**
 * Sign in with Apple (iOS only). App Review guideline 4.8: an app that offers Google sign-in
 * must also offer Sign in with Apple, so the button shows wherever Google does.
 * The backend verifies `identityToken` (loginType 'apple', `authToken` of /users and
 * /users/login) and exchanges `authorizationCode` for the refresh token it revokes when the
 * account is deleted.
 */
export interface AppleCredentials {
  /** From the identity token: Apple sends `email` in the credential only on the first sign-in */
  email: string;
  identityToken: string;
  authorizationCode: string | null;
  /** Only on the first sign-in of this Apple ID into the app; empty afterwards */
  firstName: string;
  lastName: string;
}

export class AppleSignInCancelled extends Error {
  constructor() {
    super('Apple sign-in cancelled');
    this.name = 'AppleSignInCancelled';
  }
}

let availability: Promise<boolean> | null = null;
export const isAppleSignInAvailable = (): Promise<boolean> => {
  if (Platform.OS !== 'ios') return Promise.resolve(false);
  availability ??= AppleAuthentication.isAvailableAsync().catch(() => false);
  return availability;
};

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** UTF-8 safe base64url decode without relying on a global `atob` */
const decodeBase64Url = (input: string): string => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const char of base64) {
    const value = BASE64_ALPHABET.indexOf(char);
    if (value < 0) continue;
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  return decodeURIComponent(bytes.map((b) => `%${b.toString(16).padStart(2, '0')}`).join(''));
};

/** Reads claims only; the backend verifies the signature */
const emailFromIdentityToken = (identityToken: string): string => {
  try {
    const payload = JSON.parse(decodeBase64Url(identityToken.split('.')[1] || ''));
    return typeof payload?.email === 'string' ? payload.email : '';
  } catch {
    return '';
  }
};

export const getAppleCredentials = async (): Promise<AppleCredentials> => {
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
  } catch (error: any) {
    if (error?.code === 'ERR_REQUEST_CANCELED') throw new AppleSignInCancelled();
    throw error;
  }

  const identityToken = credential.identityToken;
  if (!identityToken) throw new Error('Apple did not return an identity token');

  const email = credential.email || emailFromIdentityToken(identityToken);
  if (!email) throw new Error('Email not provided by Apple');

  return {
    email,
    identityToken,
    authorizationCode: credential.authorizationCode,
    firstName: credential.fullName?.givenName?.trim() || '',
    lastName: credential.fullName?.familyName?.trim() || '',
  };
};
