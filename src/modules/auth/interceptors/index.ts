import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/src/core/lib/tokenStorage';

export const API_URL = process.env.EXPO_PUBLIC_API as string;
export const API_URL_V2 = process.env.EXPO_PUBLIC_API_V2 as string;
export const EXPO_PUBLIC_APP_TOKEN = process.env.EXPO_PUBLIC_APP_TOKEN as string;

const REFRESH_ENDPOINT = '/users/login/refresh';

export interface AppContext {
  appToken?: string;
  appId?: string;
  apiDomain?: string;
}
let appContextProvider: () => AppContext = () => ({});
export const setAppContextProvider = (provider: () => AppContext) => {
  appContextProvider = provider;
};
const getAppToken = () => appContextProvider().appToken || EXPO_PUBLIC_APP_TOKEN || '';
const getAppId = () => appContextProvider().appId || '';

const AUTH_WHITELIST: Array<string | RegExp> = [
  '/apps/get-config',
  '/users/login-with-email',
  '/users/login',
  /^\/users\/checkEmail\//,
  '/users/sign-up-with-email',
  '/users/sign-up-resend-email',
  '/users/forgot',
  '/users/reset',
];
const APP_ID_IN_BODY = [
  '/users/login',
  '/users/login-with-email',
  '/users/sign-up-with-email',
  '/users/sign-up-resend-email',
  '/users/forgot',
];

const pathOf = (url?: string) => (url || '').split('?')[0];
const isWhitelisted = (url?: string) => {
  const path = pathOf(url);
  return AUTH_WHITELIST.some((rule) => (typeof rule === 'string' ? path === rule : rule.test(path)));
};

const $api = axios.create({ withCredentials: true, baseURL: API_URL });
const $apiV2 = axios.create({ withCredentials: true, baseURL: API_URL_V2 });

async function refreshTokens() {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await $api.post<{ token: string; refreshToken?: string; wsToken?: string }>(
    REFRESH_ENDPOINT,
    null,
    { headers: { Authorization: refreshToken } }
  );
  await tokenStorage.setAll({
    token: data.token,
    refreshToken: data.refreshToken,
    wsToken: data.wsToken,
  });
  return data.token;
}

export function attachCommonInterceptors(instance: AxiosInstance, version: 'v1' | 'v2') {
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const path = pathOf(config.url);
    const method = (config.method || 'get').toLowerCase();

    const apiDomain = appContextProvider().apiDomain;
    if (apiDomain && config.baseURL === instance.defaults.baseURL) {
      config.baseURL = `https://api.${apiDomain}/${version}`;
    }

    // Refresh sets Authorization: <refreshToken> itself
    if (path === REFRESH_ENDPOINT) return config;

    if (isWhitelisted(config.url)) {
      config.headers.Authorization = getAppToken();

      if (method === 'post' && APP_ID_IN_BODY.includes(path)) {
        const appId = getAppId();
        const body = config.data && typeof config.data === 'object' ? config.data : {};
        if (appId && !body.appId) body.appId = appId;
        config.data = body;
      }
      return config;
    }

    const access = await tokenStorage.getAccessToken();
    config.headers.Authorization = access ? `Bearer ${access}` : getAppToken();
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error.response?.status;
      const original = error.config;
      const path = pathOf(original?.url);

      if (status !== 401 || !original || original._retry || path === REFRESH_ENDPOINT || isWhitelisted(original.url)) {
        return Promise.reject(error);
      }

      original._retry = true;
      try {
        const token = await refreshTokens();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return instance.request(original);
      } catch (e) {
        await tokenStorage.clear();
        return Promise.reject(e);
      }
    }
  );
}

attachCommonInterceptors($api, 'v1');
attachCommonInterceptors($apiV2, 'v2');

export { $api, $apiV2 };
export default $api;
