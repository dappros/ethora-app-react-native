import { View } from 'react-native';
import { Loading } from '@/src/core/components/Loading';
import { useAppColors } from '@/src/core/theme';

export default function GlobalLoading() {
  const colors = useAppColors();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}>
      <Loading size={60} />
    </View>
  );
}
