import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-4">
      <Text className="text-4xl font-bold text-blue-600 mb-4">
        Hello! 👋
      </Text>
      
      <Text className="text-lg text-yellow-700 text-center mb-8">
        Tailwind CSS works with expo-router!
      </Text>

      <Link href="/about" asChild>
        <Pressable className="bg-blue-500 px-6 py-3 rounded-lg active:bg-blue-600">
          <Text className="text-white text-lg font-semibold">
            Go to the "About" page
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

