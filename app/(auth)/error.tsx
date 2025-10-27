import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthError() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
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
