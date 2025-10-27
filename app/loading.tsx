import { View } from 'react-native';
import { Loading } from '@/src/core/components/Loading';

export default function GlobalLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Loading size={60} color="#0052CD" backgroundColor="#000000" />
    </View>
  );
}
