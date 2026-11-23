import { Stack, Redirect, useSegments } from 'expo-router';
import { useAuth } from '@/src/modules/auth/hooks';
import { useConfig } from '@/src/modules/config/hooks';
import { useTermsAccepted } from '@/src/modules/legal/termsAcceptance';
import { Suspense } from 'react';
import { Loading } from '@/src/core/components';

export default function AuthLayout() {
  const { token } = useAuth();
  const { status: configStatus } = useConfig();
  const termsAccepted = useTermsAccepted();
  const segments = useSegments() as string[];

  if (token) return <Redirect href="/(app)/chat" />;

  // The terms of use come before sign-in and registration (App Review guideline 1.2)
  const onTermsScreen = segments[1] === 'terms';
  if (termsAccepted === null) return <Loading size={50} />;
  if (!termsAccepted && !onTermsScreen) return <Redirect href="/(auth)/terms" />;

  // Until the app config is loaded, every auth screen except domain is unavailable
  const onDomainScreen = segments[1] === 'domain';
  if (configStatus !== 'success' && !onDomainScreen && !onTermsScreen) {
    return <Redirect href="/(auth)/domain" />;
  }

  return (
    <Suspense fallback={<Loading size={50} />}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="terms" />
        <Stack.Screen name="domain" />
        <Stack.Screen name="login" />
      </Stack>
    </Suspense>
  );
}
