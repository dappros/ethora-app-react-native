import { View, Text, Pressable } from 'react-native';
import { useAppDispatch } from '@/src/store';
import { logout } from '@/src/modules/auth/store/auth.slice';

export default function Home() {
  const dispatch = useAppDispatch();
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-semibold mb-4">Welcome 👋</Text>
      <Pressable
        className="bg-zinc-900 rounded-xl px-4 py-2"
        onPress={() => dispatch(logout())}
      >
        <Text className="text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
