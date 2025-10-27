import { Stack, Redirect } from 'expo-router';
import { useAppSelector } from '@/src/store';
import { useAuth } from '@/src/modules/auth/hooks';
import { View, Text } from 'react-native';
import { Suspense } from 'react';
import { Loading } from '@/src/core/components';

export default function AuthLayout() {
  const { token } = useAuth();
  
  if (token) return <Redirect href="/(app)" />;
  return (
    <Suspense fallback={<Loading size={50} color="#0052CD" backgroundColor="#000000" />}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
      </Stack>
    </Suspense>
  );
}