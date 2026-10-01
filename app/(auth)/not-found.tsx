import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppColors } from '@/src/core/theme';

export default function AuthNotFound() {
  const router = useRouter();
  const colors = useAppColors();

  return (
    <View
      className="flex-1 items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}>
      <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>404</Text>
      <Text className="text-lg mb-4" style={{ color: colors.textSecondary }}>Page not found</Text>
      <Pressable 
        onPress={() => router.replace('/(auth)/login')}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        <Text className="text-white">Go to Login</Text>
      </Pressable>
    </View>
  );
}
