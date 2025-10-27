import { View, Text } from 'react-native';
import { Loading } from '@/src/core/components/Loading';

export default function AuthLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Loading...</Text>
    </View>
  );
}
