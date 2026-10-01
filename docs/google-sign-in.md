# Google sign-in

Same flow as the web app (`ethora-app-reactjs/src/pages/AuthPage/GoogleButton.tsx`):

1. Native Google sign-in (`@react-native-google-signin/google-signin`) → Google ID token + access token.
2. Firebase Auth (`firebase` JS SDK, in-memory persistence) `signInWithCredential` → **Firebase ID token**.
   The backend verifies this token, not the Google one.
3. `GET /users/checkEmail/:email` → `success: true` means the email is free →
   `POST /users` (social sign-up, `loginType: 'google'`, `utm: 'mobile-app'`).
   `userRegistrationDisabled` on the workspace blocks this step with a message.
4. `POST /users/login` with `{ idToken, accessToken, loginType: 'google', authToken: 'authToken' }` →
   tokens go to the auth store exactly like the email login.

Code: `src/modules/auth/lib/googleSignIn.ts` (steps 1–2), `authGoogleLoginRequest` in
`src/modules/auth/store/auth.thunk.ts` (steps 3–4), `GoogleSignInButton` (UI + errors).

## Which Firebase project

- The workspace's `firebaseWebConfigString` (parsed into `config.firebaseConfigParsed`, as on web) when set,
  otherwise `EXPO_PUBLIC_FIREBASE_*` from `.env` (Ethora project `ethora-668e9`).
- The Google OAuth clients (`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`) are baked into the
  build and belong to one Firebase project. A workspace whose Firebase project is a different one cannot use Google
  sign-in from this build — Firebase rejects an ID token issued for another project's client
  (`auth/invalid-credential`).
- The button is shown only when the clients are configured and the workspace's `signonOptions` includes `google`
  (the web gate).

## One-time setup

### Android

`google-services.json` of `ethora-668e9` already lists package `com.ethora` with the debug keystore SHA-1
of this machine, so `expo run:android` works as is. Every other signing key (another machine, EAS / Play
upload key) must be added in Firebase console → Project settings → Android app `com.ethora` → SHA certificate
fingerprints, and `google-services.json` re-downloaded. Otherwise the sheet fails with `DEVELOPER_ERROR`.

Web client id: `oauth_client` entry with `client_type: 3` in `google-services.json`.

### iOS

The project has an iOS client only for bundle `com.ethora`; this app is `com.ethora.app`.

1. Firebase console → Project settings → Add app → iOS, bundle id `com.ethora.app`.
2. Authentication → Sign-in method → Google must be enabled (it is, the web uses it).
3. Take the iOS client id (`GoogleService-Info.plist` → `CLIENT_ID`, or Google Cloud → Credentials):
   - `.env` → `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=<id>.apps.googleusercontent.com`
   - `app.json` → plugin `@react-native-google-signin/google-signin` → `iosUrlScheme` =
     `REVERSED_CLIENT_ID` from the plist (`com.googleusercontent.apps.<id>`).
4. `npx expo prebuild` + `expo run:ios` (the URL scheme is native).

Until step 3 is done `isGoogleSignInConfigured()` is false on iOS and the button is hidden.
