import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '@/src/modules/auth/hooks';
import { useConfig } from '@/src/modules/config/hooks';
import { tokenStorage } from '@/src/core/lib/tokenStorage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { View, Text } from 'react-native';
import { Loading } from '@/src/core/components';

export const EXPO_PUBLIC_DOMAIN_NAME = process.env.EXPO_PUBLIC_DOMAIN_NAME as string;

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const auth = useAuth();
  const { geConfigApp, status: configStatus } = useConfig();

  const [ready, setReady] = useState(false);
  const navigatedRef = useRef(false);

  // Инициализация: сначала CHECK, потом CONFIG
  useEffect(() => {
    const initialize = async () => {
      try {
        await auth.check();
        await geConfigApp(EXPO_PUBLIC_DOMAIN_NAME);
        setReady(true);
      } catch (error) {
        console.log('Initialization error:', error);
        setReady(true);
      }
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (!ready || navigatedRef.current) return;

    const inAuthGroup = segments[0] === '(auth)';
    const hasToken = !!auth.token;

    if (!hasToken && !inAuthGroup) {
      navigatedRef.current = true;
      router.replace('/(auth)/login');
    } else if (hasToken && inAuthGroup) {
      navigatedRef.current = true;
      router.replace('/(app)');
    }
  }, [ready, segments, auth.token]);

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
          <AuthGate />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
