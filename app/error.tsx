import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppColors } from '@/src/core/theme';

export default function GlobalError() {
  const router = useRouter();
  const colors = useAppColors();

  return (
    <View
      className="flex-1 items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}>
      <Text className="text-xl font-bold text-red-500 mb-4">App Error</Text>
      <Text className="text-center mb-4" style={{ color: colors.text }}>Something went wrong with the app</Text>
      <Pressable 
        onPress={() => router.replace('/')}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Restart App</Text>
      </Pressable>
    </View>
  );
}
