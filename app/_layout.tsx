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

export const EXPO_PUBLIC_DOMAIN_NAME = process.env.EXPO_PUBLIC_DOMAIN_NAME as string;

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const auth = useAuth();
  const { geConfigApp } = useConfig();

  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    geConfigApp(EXPO_PUBLIC_DOMAIN_NAME);
    auth.check();
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthGate />
          <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
