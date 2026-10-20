import AsyncStorage from '@react-native-async-storage/async-storage';
import { PushRegistrationRecord } from '@modules/push/types';

const registrationStorage = (key: string) => ({
  get: async (): Promise<PushRegistrationRecord | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as PushRegistrationRecord) : null;
    } catch {
      return null;
    }
  },
  set: (record: PushRegistrationRecord) => AsyncStorage.setItem(key, JSON.stringify(record)),
  clear: () => AsyncStorage.removeItem(key),
});

/** Persisted record of the active push registration (token + domain + appId + userId). */
export const pushStorage = registrationStorage('push.registration');

/** The same for the iOS PushKit (VoIP) token, registered next to the APNs one. */
export const voipPushStorage = registrationStorage('push.registration.voip');
