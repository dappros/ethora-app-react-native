import { AxiosResponse } from 'axios';
import { AuthLoginFetchDataValue, AuthRefreshResponse, AuthRegistrationFetchDataValue, AuthResponse } from '@modules/auth/types';
import { $api, $apiV2 } from '@modules/auth/interceptors';
import { tokenStorage } from '@/src/core/lib/tokenStorage';

export const authLogin = (payload: AuthLoginFetchDataValue): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>('/users/login-with-email', payload);
};

export const authCheck = (): Promise<AxiosResponse<AuthResponse>> => {
  return $api.get<AuthResponse>('/users/me');
};

export const authRefresh = async (): Promise<AxiosResponse<AuthRefreshResponse>> => {
  // Refresh is authorized with the refresh token (as in ethora-app-reactjs/src/authRefresh.ts)
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  return $api.post<AuthRefreshResponse>('/users/login/refresh', null, {
    headers: { Authorization: refreshToken },
  });
};

export const authRegistretion = (payload: AuthRegistrationFetchDataValue): Promise<AxiosResponse<AuthResponse>> => {
  return $apiV2.post<AuthResponse>('/users/sign-up-with-email', payload);
};

