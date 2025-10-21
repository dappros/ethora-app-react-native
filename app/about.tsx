import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center p-4">
      <View className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          About the app
        </Text>
        
        <Text className="text-base text-gray-600 mb-6 leading-6">
          This is an example of an app with expo-router and NativeWind (Tailwind CSS).
          You can create pages by simply adding files to the app/ folder!
        </Text>

        <Pressable 
          onPress={() => router.back()}
          className="bg-gray-800 px-6 py-3 rounded-lg active:bg-gray-900"
        >
          <Text className="text-white text-center text-lg font-semibold">
            ← Back
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

