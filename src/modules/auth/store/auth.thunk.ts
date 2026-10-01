import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  authCheck,
  authCheckEmail,
  authLogin,
  authRefresh,
  authRegistretion,
  authSocialLogin,
  authSocialRegister,
} from '@modules/auth/fetch/auth.fetch';
import { getGoogleCredentials } from '@modules/auth/lib/googleSignIn';
import { ENV_FIREBASE_CONFIG } from '@modules/config/utils/firebaseConfig';
import { AuthLoginFetchDataValue, AuthRefreshResponse, AuthRegistrationFetchDataValue, AuthResponse } from '@modules/auth/types';
import { BaseAsyncThunkOptions } from '@core/types';

export class GoogleRegistrationClosed extends Error {
  constructor() {
    super('Registration is closed for this workspace');
    this.name = 'GoogleRegistrationClosed';
  }
}

export const authLoginRequest = createAsyncThunk<
  AuthResponse,
  AuthLoginFetchDataValue,
  BaseAsyncThunkOptions
>(
  'auth/login-with-email',
  async (data, thunkApi) => {
    try {
      const response = await authLogin(data);

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const authRegistrationRequest = createAsyncThunk<
  AuthResponse,
  AuthRegistrationFetchDataValue,
  BaseAsyncThunkOptions
>(
  'auth/sign-up-with-email',
  async (data, thunkApi) => {
    try {
      const response = await authRegistretion(data);

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

/**
 * Google sign-in, same steps as the web GoogleButton: Google → Firebase ID token →
 * checkEmail → (register as a new social user) → social login.
 * Cancel and configuration errors are thrown as-is to the caller (not rejectWithValue),
 * so the button can tell a dismissed sheet from a failed request.
 */
export const authGoogleLoginRequest = createAsyncThunk<
  AuthResponse,
  { utm?: string } | undefined,
  BaseAsyncThunkOptions
>(
  'auth/login-with-google',
  async (data, thunkApi) => {
    const app = thunkApi.getState().config.config;
    const firebaseConfig = app.firebaseConfigParsed || ENV_FIREBASE_CONFIG;
    if (!firebaseConfig) throw new Error('Firebase config is missing for this workspace');

    const { email, firebaseIdToken, googleAccessToken } = await getGoogleCredentials(firebaseConfig);
    const social = { idToken: firebaseIdToken, accessToken: googleAccessToken, loginType: 'google' as const };

    // success: true → the email is free → register first
    let shouldRegister = false;
    try {
      shouldRegister = Boolean((await authCheckEmail(email, app._id)).data.success);
    } catch (error: any) {
      const alreadyExists =
        error?.response?.status === 422 && error?.response?.data?.code === 'EMAIL_ALREADY_EXISTS';
      if (!alreadyExists) return thunkApi.rejectWithValue(error);
    }

    if (shouldRegister && app.userRegistrationDisabled) throw new GoogleRegistrationClosed();

    try {
      if (shouldRegister) {
        const registered = await authSocialRegister({ ...social, utm: data?.utm });
        if (!registered.data?.user) throw new Error('Social registration failed');
      }
      const response = await authSocialLogin(social);

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const authCheckRequest = createAsyncThunk<
  AuthResponse,
  undefined,
  BaseAsyncThunkOptions
>(
  'auth/me',
  async (_, thunkApi) => {
    try {
      const response = await authCheck();

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const autRefreshRequest = createAsyncThunk<
  AuthRefreshResponse,
  undefined,
  BaseAsyncThunkOptions
>(
  'auth/refresh',
  async (_, thunkApi) => {
    try {
      const response = await authRefresh();

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
