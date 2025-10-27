import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthNotFound() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-2">404</Text>
      <Text className="text-lg text-gray-600 mb-4">Page not found</Text>
      <Pressable 
        onPress={() => router.replace('/(auth)/login')}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        <Text className="text-white">Go to Login</Text>
      </Pressable>
    </View>
  );
}
