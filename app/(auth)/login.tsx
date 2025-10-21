import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { loginThunk } from '@/src/modules/auth/store/auth.slice';

export default function Login() {
  const [email, setEmail] = useState('demo@ethora.dev');
  const [password, setPassword] = useState('demo');
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);

  const onLogin = () => {
    dispatch(loginThunk({ email, password }));
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Sign in</Text>

      <TextInput
        className="border rounded-xl px-4 py-3 mb-3"
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border rounded-xl px-4 py-3 mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text className="text-red-600 mb-2">{error}</Text> : null}

      <Pressable
        className="bg-black rounded-xl py-3 items-center"
        onPress={onLogin}
        disabled={status === 'loading'}
      >
        <Text className="text-white font-semibold">
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </Text>
      </Pressable>
    </View>
  );
}
