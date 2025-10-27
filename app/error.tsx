import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function GlobalError() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-xl font-bold text-red-500 mb-4">App Error</Text>
      <Text className="text-center mb-4">Something went wrong with the app</Text>
      <Pressable 
        onPress={() => router.replace('/')}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Restart App</Text>
      </Pressable>
    </View>
  );
}
