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
    console.log('Saving tokens:', {
      token: t.token,
      tokenType: typeof t.token,
      refreshToken: t.refreshToken,
      refreshTokenType: typeof t.refreshToken,
      wsToken: t.wsToken,
      wsTokenType: typeof t.wsToken,
    });

    if (t.token && typeof t.token === 'string') {
      await SecureStore.setItemAsync(ACCESS_KEY, t.token);
    } else {
      throw new Error(`Invalid token type: ${typeof t.token}, value: ${t.token}`);
    }
    
    if (t.refreshToken && typeof t.refreshToken === 'string') {
      await SecureStore.setItemAsync(REFRESH_KEY, t.refreshToken);
    }
    
    if (t.wsToken && typeof t.wsToken === 'string') {
      await SecureStore.setItemAsync(WS_KEY, t.wsToken);
    }
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    await SecureStore.deleteItemAsync(WS_KEY);
  },
};
