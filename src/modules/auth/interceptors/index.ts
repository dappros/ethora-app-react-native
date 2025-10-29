import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Tokens, tokenStorage } from '@/src/core/lib/tokenStorage';

export const API_URL = process.env.EXPO_PUBLIC_API as string;
export const API_URL_V2 = process.env.EXPO_PUBLIC_API_V2 as string;
export const EXPO_PUBLIC_APP_TOKEN = process.env.EXPO_PUBLIC_APP_TOKEN as string;

const $api = axios.create({ withCredentials: true, baseURL: API_URL });
const $apiV2 = axios.create({ withCredentials: true, baseURL: API_URL_V2 });

if(EXPO_PUBLIC_APP_TOKEN) {
  $api.defaults.headers.common["Authorization"] = EXPO_PUBLIC_APP_TOKEN ;
  $apiV2.defaults.headers.common["Authorization"] = EXPO_PUBLIC_APP_TOKEN ;
}

async function refreshTokens(baseURL: string): Promise<Tokens> {
    const rt = await tokenStorage.getRefreshToken();
    if (!rt) throw new Error('No refresh token');
  
    const { data } = await axios.post<{
      token: string; refreshToken?: string; wsToken?: string;
    }>(`${$api}/users/refresh`, { refreshToken: rt });
  
    return {
      token: data.token,
      refreshToken: data.refreshToken,
      wsToken: data.wsToken,
    };
  }

  export function attachCommonInterceptors(instance: AxiosInstance, baseURL: string) {
    instance.interceptors.request.use(async (config) => {
      const access = await tokenStorage.getAccessToken();
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
      return config;
    });
  
    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error.response?.status;
        const original = error.config;
  
        if (status === 401 && original && !original._retry) {
          original._retry = true;
  
          try {
            const newTokens = await refreshTokens(baseURL);
            await tokenStorage.setAll(newTokens);
  
            original.headers = original.headers ?? {};
            (original.headers as any).Authorization = `Bearer ${newTokens.token}`;
  
            return instance.request(original);
          } catch (e) {
            await tokenStorage.clear();
            return Promise.reject(e);
          }
        }
  
        return Promise.reject(error);
      }
    );
  }

attachCommonInterceptors($api, API_URL);
attachCommonInterceptors($apiV2, API_URL_V2);

export { $api, $apiV2 };
export default $api;
