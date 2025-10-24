import { Stack, Redirect } from 'expo-router';
import { useAppSelector } from '@/src/store';
import { useAuth } from '@/src/modules/auth/hooks';
import { View, Text } from 'react-native';

export default function AuthLayout() {
  const { token, status } = useAuth();

  if(status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    )
  }
  
  if (token) return <Redirect href="/(app)" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}