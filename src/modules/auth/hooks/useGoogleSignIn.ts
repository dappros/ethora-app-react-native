// // src/modules/auth/hooks/useGoogleSignIn.ts
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { useEffect } from 'react';
// import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
// import {
//   getAuth,
//   signInWithCredential,
//   GoogleAuthProvider,
// } from 'firebase/auth';
// import { useAppStore } from '@/src/store/useAppStore';
// import {
//   httpCheckEmailExist,
//   httpLoginSocial,
//   httpRegisterSocial,
//   sendHSFormData,
// } from '@/src/http';
// import { actionAfterLogin } from '@/src/actions';
// import { navigateToUserPage } from '@/src/utils/navigateToUserPage';
// import { useRouter } from 'expo-router';

// // required for WebBrowser to complete the session (iOS)
// WebBrowser.maybeCompleteAuthSession();

// function getFirebase(): FirebaseApp {
//   if (getApps().length) return getApp();
//   const cfg = useAppStore.getState().currentApp?.firebaseConfigParsed;
//   if (!cfg) throw new Error('Firebase config not found in currentApp');
//   return initializeApp({
//     apiKey: cfg.apiKey,
//     authDomain: cfg.authDomain,
//     projectId: cfg.projectId,
//     storageBucket: cfg.storageBucket,
//     messagingSenderId: cfg.messagingSenderId,
//     appId: cfg.appId,
//     measurementId: cfg.measurementId,
//   });
// }

// type Options = { utm?: string | null };

// export function useGoogleSignIn({ utm }: Options = {}) {
//   const config = useAppStore.getState().currentApp;
//   const router = useRouter();

//   // take clientIds from Google Cloud OAuth (Firebase → Authentication → Sign-in method → Google)
//   const expoClientId    = config?.firebaseConfigParsed?.expoClientId;     // optional
//   const iosClientId     = config?.firebaseConfigParsed?.iosClientId;
//   const androidClientId = config?.firebaseConfigParsed?.androidClientId;
//   const webClientId     = config?.firebaseConfigParsed?.webClientId;       // useful for dev/web

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId,
//     iosClientId,
//     androidClientId,
//     webClientId,
//     scopes: ['profile', 'email'],
//     // use the proxy in Expo Go — handy in dev
//     useProxy: true,
//   });

//   const signIn = async () => {
//     // opens the system Google sign-in UI
//     await promptAsync();
//   };

//   useEffect(() => {
//     (async () => {
//       if (response?.type !== 'success') return;

//       const idToken = (response.params as any).id_token;
//       const accessToken = (response.params as any).access_token;

//       // 1) Firebase sign-in
//       const app = getFirebase();
//       const auth = getAuth(app);
//       const credential = GoogleAuthProvider.credential(idToken, accessToken);
//       const result = await signInWithCredential(auth, credential);
//       const user = result.user;

//       // 2) idToken for the backend
//       const freshIdToken = await user.getIdToken();

//       // 3) check email and register/login like on web
//       const email = user.email;
//       if (!email) throw new Error('Email not provided by Google');

//       const emailExist = await httpCheckEmailExist(email);

//       // new registration
//       if (emailExist.data.success) {
//         const userResult = await httpRegisterSocial(
//           freshIdToken,
//           accessToken ?? '',
//           '',
//           'google',
//           '',
//           utm || ''
//         );

//         if (!userResult?.data?.user) {
//           throw new Error('Social registration failed');
//         }

//         // ⚠️ HubSpot and cookies are web-specific. Usually skipped in RN.
//         // If really needed, call sendHSFormData without document/cookie.
//         // try { await sendHSFormData(...); } catch {}

//         const { data } = await httpLoginSocial(freshIdToken, accessToken ?? '', 'google');
//         await actionAfterLogin(data);
//         navigateToUserPage(router, config?.afterLoginPage);
//         return;
//       }

//       // existing user
//       const { data } = await httpLoginSocial(freshIdToken, accessToken ?? '', 'google');
//       await actionAfterLogin(data);
//       navigateToUserPage(router, config?.afterLoginPage);
//     })().catch((e) => {
//       console.error('Google sign-in failed:', e);
//       // a toast/snackbar could be shown here
//     });
//   }, [response]);

//   return { request, signIn };
// }
