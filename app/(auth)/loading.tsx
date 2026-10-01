import { View, Text } from 'react-native';
import { useAppColors } from '@/src/core/theme';

export default function AuthLoading() {
  const colors = useAppColors();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Loading...</Text>
    </View>
  );
}
