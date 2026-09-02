import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/src/modules/auth/hooks';
import { useConfig } from '@/src/modules/config/hooks';
import { usePushNotifications } from '@/src/modules/push';

export default function AppLayout() {
  const { token } = useAuth();
  const { status: configStatus } = useConfig();

  // Registers the device push token on the current domain's API and handles
  // notification taps. No-ops until auth + config are ready.
  usePushNotifications();

  if (!token) {
    return <Redirect href={configStatus === 'success' ? '/(auth)/login' : '/(auth)/domain'} />;
  }

  return (
    <Tabs initialRouteName="chat" screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
    </Tabs>
  );
}
