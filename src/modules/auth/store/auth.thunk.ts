import { createAsyncThunk } from '@reduxjs/toolkit';
import { authCheck, authLogin, authRefresh } from '@modules/auth/fetch/auth.fetch';
import { AuthLoginFetchDataValue, AuthRefreshResponse, AuthRegistrationFetchDataValue, AuthResponse } from '@modules/auth/types';
import { BaseAsyncThunkOptions } from '@core/types';

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
      const response = await authLogin(data);

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
