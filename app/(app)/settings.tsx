import { View, Text } from 'react-native';
import { useAppColors } from '@/src/core/theme';

export default function Settings() {
  const colors = useAppColors();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}>
      <Text className="text-lg" style={{ color: colors.text }}>Settings</Text>
    </View>
  );
}
