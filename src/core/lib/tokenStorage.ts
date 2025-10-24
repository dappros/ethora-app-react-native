import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'token';
const REFRESH_KEY = 'refreshToken';
const WS_KEY = 'wsToken';

export type Tokens = {
  token: string;
  refreshToken?: string;
  wsToken?: string;
};

export const tokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_KEY),
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_KEY),
  getWsToken: () => SecureStore.getItemAsync(WS_KEY),

  setAll: async (t: Tokens) => {
    await SecureStore.setItemAsync(ACCESS_KEY, t.token);
    if (t.refreshToken) await SecureStore.setItemAsync(REFRESH_KEY, t.refreshToken);
    if (t.wsToken) await SecureStore.setItemAsync(WS_KEY, t.wsToken);
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    await SecureStore.deleteItemAsync(WS_KEY);
  },
};
