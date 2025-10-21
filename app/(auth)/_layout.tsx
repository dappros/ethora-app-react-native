import { Stack, Redirect } from 'expo-router';
import { useAppSelector } from '@/src/store';

export default function AuthLayout() {
  const token = useAppSelector(s => s.auth.token);
  if (token) return <Redirect href="/(app)" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}