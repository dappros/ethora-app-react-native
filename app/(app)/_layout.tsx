import { Tabs, Redirect } from 'expo-router';
import { useAppSelector } from '@/src/store';

export default function AppLayout() {
  const token = useAppSelector(s => s.auth.token);
  if (!token) return <Redirect href="/(auth)/login" />;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
