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
import { View, Text } from 'react-native';
import { Loading } from '@/src/core/components';

export const EXPO_PUBLIC_DOMAIN_NAME = process.env.EXPO_PUBLIC_DOMAIN_NAME as string;

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const auth = useAuth();
  const { geConfigApp, restoreDomain, status: configStatus } = useConfig();

  const [ready, setReady] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await auth.check().catch((error) => console.log('Auth check error:', error));

        const savedWorkspace = await restoreDomain();
        if (savedWorkspace) {
          await geConfigApp(savedWorkspace);
        }
      } catch (error) {
        console.log('Initialization error:', error);
      } finally {
        setReady(true);
      }
    };
    
    initialize();
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
      <View className="flex-1 items-center justify-center bg-white">
        <Loading size={50} color="#0052CD" backgroundColor="#000000" />
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
            <AuthGate />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
