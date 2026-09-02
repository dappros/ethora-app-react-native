import AsyncStorage from '@react-native-async-storage/async-storage';
import { PushRegistrationRecord } from '@modules/push/types';

const KEY = 'push.registration';

/** Persisted record of the active push registration (token + domain + appId + userId). */
export const pushStorage = {
  get: async (): Promise<PushRegistrationRecord | null> => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as PushRegistrationRecord) : null;
    } catch {
      return null;
    }
  },
  set: (record: PushRegistrationRecord) => AsyncStorage.setItem(KEY, JSON.stringify(record)),
  clear: () => AsyncStorage.removeItem(KEY),
};
