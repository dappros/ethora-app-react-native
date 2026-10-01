import { Platform } from 'react-native';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, initializeAuth, inMemoryPersistence, signInWithCredential } from 'firebase/auth';
import { FirebaseWebConfig } from '@modules/config/types';

/**
 * Google OAuth clients of the build's Firebase project (Firebase console → Authentication →
 * Sign-in method → Google, or google-services.json `oauth_client` with client_type 3).
 * The iOS client must be created for this bundle id; its reversed id also goes to
 * app.json → plugins → @react-native-google-signin/google-signin → iosUrlScheme.
 */
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
export const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';

export const isGoogleSignInConfigured = (): boolean =>
  Boolean(GOOGLE_WEB_CLIENT_ID && (Platform.OS !== 'ios' || GOOGLE_IOS_CLIENT_ID));

export interface GoogleCredentials {
  email: string;
  /** Firebase ID token — what the Ethora backend verifies (`idToken` of /users/login) */
  firebaseIdToken: string;
  /** Google OAuth access token (`accessToken` of /users/login) */
  googleAccessToken: string;
}

export class GoogleSignInCancelled extends Error {
  constructor() {
    super('Google sign-in cancelled');
    this.name = 'GoogleSignInCancelled';
  }
}

let configured = false;
const configureOnce = () => {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    scopes: ['profile', 'email'],
  });
  configured = true;
};

/** One Firebase app per project: a workspace may carry its own web config, the base app uses env */
const firebaseAppFor = (config: FirebaseWebConfig): FirebaseApp => {
  const name = config.projectId;
  const existing = getApps().find((app) => app.name === name);
  if (existing) return existing;
  const app = initializeApp(config, name);
  // No session persistence: the Firebase user is only a bridge to mint the ID token
  initializeAuth(app, { persistence: inMemoryPersistence });
  return app;
};

/**
 * Native Google sign-in → Firebase credential → Firebase ID token, the same trio the web
 * sends to the backend (ethora-app-reactjs/src/pages/AuthPage/firebase.ts getUserCredsFromGoogle).
 * Throws GoogleSignInCancelled when the user dismisses the sheet.
 */
export const getGoogleCredentials = async (firebaseConfig: FirebaseWebConfig): Promise<GoogleCredentials> => {
  configureOnce();

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  let response;
  try {
    response = await GoogleSignin.signIn();
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new GoogleSignInCancelled();
    }
    throw error;
  }
  if (response.type !== 'success') throw new GoogleSignInCancelled();

  const googleIdToken = response.data.idToken;
  if (!googleIdToken) throw new Error('Google did not return an ID token');
  const { accessToken: googleAccessToken } = await GoogleSignin.getTokens();

  const auth = getAuth(firebaseAppFor(firebaseConfig));
  const credential = GoogleAuthProvider.credential(googleIdToken, googleAccessToken);
  const { user } = await signInWithCredential(auth, credential);

  const email = user.email || user.providerData[0]?.email || response.data.user.email;
  if (!email) throw new Error('Email not provided by Google');

  return {
    email,
    firebaseIdToken: await user.getIdToken(),
    googleAccessToken,
  };
};

/** Drop the cached Google account so the next sign-in shows the account picker again */
export const signOutGoogle = async () => {
  try {
    configureOnce();
    await GoogleSignin.signOut();
  } catch {
    // not signed in with Google — nothing to do
  }
};
