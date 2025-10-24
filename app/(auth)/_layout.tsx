import { Stack, Redirect } from 'expo-router';
import { useAppSelector } from '@/src/store';
import { useAuth } from '@/src/modules/auth/hooks';
import { View, Text } from 'react-native';

export default function AuthLayout() {
  const { token } = useAuth();
  
  if (token) return <Redirect href="/(app)" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}