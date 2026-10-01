import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppColors } from '@/src/core/theme';

export default function AuthError() {
  const router = useRouter();
  const colors = useAppColors();

  return (
    <View
      className="flex-1 items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}>
      <Text className="text-lg text-red-500 mb-4">Something went wrong!</Text>
      <Pressable 
        onPress={() => router.replace('/(auth)/login')}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        <Text className="text-white">Try Again</Text>
      </Pressable>
    </View>
  );
}
