import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '@/src/modules/auth/hooks';
import { useConfig } from '@/src/modules/config/hooks';
import { tokenStorage } from '@/src/core/lib/tokenStorage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import * as Linking from 'expo-linking';
import '../global.css';
import { AppState, LogBox, View, Text } from 'react-native';
import { Loading } from '@/src/core/components';
import { StatusBar } from 'expo-status-bar';
import { useAppColors } from '@/src/core/theme';
import { discardStalePushRegistration } from '@/src/modules/push/service/pushService';
import { clearAppNotifications } from '@/src/modules/push/service/appIconBadge';

if (__DEV__) {
  LogBox.ignoreAllLogs();
}

export const EXPO_PUBLIC_DOMAIN_NAME = process.env.EXPO_PUBLIC_DOMAIN_NAME as string;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// iOS also launches the app in the background (VoIP and silent pushes,
// background fetch), with the keychain possibly still locked and the network
// asleep. The session is decided once, so only in the foreground — deciding
// in the background showed the sign-in screen to a signed-in user.
const untilForeground = () =>
  new Promise<void>((resolve) => {
    if (AppState.currentState !== 'background') return resolve();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') return;
      subscription.remove();
      resolve();
    });
  });

// The server refused the session itself (expired, revoked, user gone), as
// opposed to not answering: no network, a timeout, a 5xx.
const isSessionRejected = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return !!status && status >= 400 && status < 500 && status !== 408 && status !== 429;
};

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const auth = useAuth();
  const { geConfigApp, restoreDomain, status: configStatus } = useConfig();
  const colors = useAppColors();

  const [ready, setReady] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // Signed out without a logout (expired session, or the tokens are gone):
    // nothing of the old session may keep reaching the device.
    const discardSession = async () => {
      await tokenStorage.clear().catch(() => {});
      await discardStalePushRegistration();
      await clearAppNotifications();
    };

    // Resolves once the session is known: restored, or there is none. A check
    // that fails for want of an answer is retried rather than read as signed out.
    const restoreSession = async () => {
      for (let attempt = 0; !cancelled; attempt++) {
        let access: string | null;
        try {
          access = await tokenStorage.getAccessToken();
        } catch (error) {
          console.log('Token read error:', error);
          await wait(Math.min(1000 * 2 ** attempt, 15000));
          continue;
        }
        if (!access) return discardSession();

        try {
          await auth.check();
          return;
        } catch (error) {
          // The refresh interceptor deletes the tokens when the server refuses the refresh token
          const stillSignedIn = await tokenStorage.getAccessToken().catch(() => access);
          if (isSessionRejected(error) || !stillSignedIn) return discardSession();
          console.log('Auth check error, retrying:', error);
          await wait(Math.min(1000 * 2 ** attempt, 15000));
        }
      }
    };

    const initialize = async () => {
      try {
        await untilForeground();

        const savedWorkspace = await restoreDomain();
        if (savedWorkspace) {
          await geConfigApp(savedWorkspace).catch((error) => console.log('Config restore error:', error));
        }

        await restoreSession();
      } catch (error) {
        console.log('Initialization error:', error);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = new URL(event.url);
      if (url.pathname === '/turnstile') {
        const token = url.searchParams.get('token');
        const error = url.searchParams.get('error');
        
        if (token) {
          console.log('Turnstile token received:', token);
        } else if (error) {
          console.log('Turnstile error:', error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check the initial URL on launch
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (!ready || navigatedRef.current) return;

    const inAuthGroup = segments[0] === '(auth)';
    const hasToken = !!auth.token;
    const hasConfig = configStatus === 'success';

    if (!hasToken && !hasConfig) {
      navigatedRef.current = true;
      router.replace('/(auth)/domain');
    } else if (!hasToken && !inAuthGroup) {
      navigatedRef.current = true;
      router.replace('/(auth)/login');
    } else if (hasToken && inAuthGroup) {
      navigatedRef.current = true;
      router.replace('/(app)/chat');
    }
  }, [ready, segments, auth.token, configStatus]);

  if (!ready) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}>
        <Loading size={50} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <StatusBar style="auto" />
            <AuthGate />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
