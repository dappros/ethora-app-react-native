import { Slot, useRouter, useSegments } from 'expo-router';
import { Provider } from 'react-redux';
import { store, useAppSelector, useAppDispatch } from '@/src/store';
import { useEffect } from 'react';
import { restore } from '@/src/modules/auth/store/auth.slice';
import '../global.css';


// если хочешь восстановление токена из SecureStore — добавь тут

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // пример восстановления (демо-данные)
    dispatch(restore({ token: null as any, user: null })); // если нужно
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [segments, token]);

  return null;
}

