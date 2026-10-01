import { FirebaseWebConfig } from '@modules/config/types';

/**
 * Firebase web config of the build's own project (Ethora). Used when the workspace
 * config carries no firebaseWebConfigString. Must be the project that owns the Google
 * OAuth clients from EXPO_PUBLIC_GOOGLE_*_CLIENT_ID — Firebase rejects a Google ID token
 * issued for a client of another project.
 */
export const ENV_FIREBASE_CONFIG: FirebaseWebConfig | null = process.env.EXPO_PUBLIC_FIREBASE_API_KEY
  ? {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
      measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    }
  : null;

/**
 * Port of ethora-app-reactjs/src/utils/getFbConfig.ts: the admin pastes the whole
 * `const firebaseConfig = { apiKey: "...", ... }` snippet from the Firebase console
 * into app settings; pick the object literal out of it and parse it as JSON.
 */
export const parseFirebaseWebConfig = (input?: string | null): FirebaseWebConfig | null => {
  if (!input) return null;

  const objects = [...input.matchAll(/{([^}]+)}/g)].map((m) => m[0]);
  const configString = objects.find((o) => o.includes('authDomain') || o.includes('apiKey'));
  if (!configString) return null;

  try {
    // Quote the keys: `{ apiKey: "x" }` → `{ "apiKey": "x" }`
    const json = configString.replace(/([,{]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    const parsed = JSON.parse(json) as Partial<FirebaseWebConfig>;
    if (!parsed.apiKey || !parsed.projectId) return null;
    return {
      apiKey: parsed.apiKey,
      authDomain: parsed.authDomain || '',
      projectId: parsed.projectId,
      storageBucket: parsed.storageBucket || '',
      messagingSenderId: parsed.messagingSenderId || '',
      appId: parsed.appId || '',
      measurementId: parsed.measurementId || '',
    };
  } catch {
    return null;
  }
};
