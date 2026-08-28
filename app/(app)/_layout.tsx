import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/src/modules/auth/hooks';
import { useConfig } from '@/src/modules/config/hooks';

export default function AppLayout() {
  const { token } = useAuth();
  const { status: configStatus } = useConfig();

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
