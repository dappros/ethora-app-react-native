import { AxiosResponse } from 'axios';
import { AuthLoginFetchDataValue, AuthRefreshResponse, AuthRegistrationFetchDataValue, AuthResponse } from '@modules/auth/types';
import{ $api, $apiV2 } from '@modules/auth/interceptors';

export const authLogin = (payload: AuthLoginFetchDataValue): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>('/users/login-with-email', payload);
};

export const authCheck = (): Promise<AxiosResponse<AuthResponse>> => {
  return $api.get<AuthResponse>('/users/me');
};

export const authRefresh = (): Promise<AxiosResponse<AuthRefreshResponse>> => {
  return $api.get<AuthRefreshResponse>('/users/login/refresh');
};

export const authRegistretion = (payload: AuthRegistrationFetchDataValue): Promise<AxiosResponse<AuthResponse>> => {
  return $apiV2.post<AuthResponse>('/users/sign-up-with-email', payload);
};

