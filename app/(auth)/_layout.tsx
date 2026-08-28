import { Stack, Redirect, useSegments } from 'expo-router';
import { useAuth } from '@/src/modules/auth/hooks';
import { useConfig } from '@/src/modules/config/hooks';
import { Suspense } from 'react';
import { Loading } from '@/src/core/components';

export default function AuthLayout() {
  const { token } = useAuth();
  const { status: configStatus } = useConfig();
  const segments = useSegments() as string[];

  if (token) return <Redirect href="/(app)/chat" />;

  // Until the app config is loaded, every auth screen except domain is unavailable
  const onDomainScreen = segments[1] === 'domain';
  if (configStatus !== 'success' && !onDomainScreen) {
    return <Redirect href="/(auth)/domain" />;
  }

  return (
    <Suspense fallback={<Loading size={50} color="#0052CD" backgroundColor="#000000" />}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="domain" />
        <Stack.Screen name="login" />
      </Stack>
    </Suspense>
  );
}
