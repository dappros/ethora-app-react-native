import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginApi } from '../fetch/auth.api';
import type { User } from '../types/types';

type AuthState = {
  user: User;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
};

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await loginApi(payload.email, payload.password);
    return res;
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = undefined;
    },
    restore(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => { s.status = 'loading'; s.error = undefined; });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.status = 'succeeded';
      s.token = a.payload.token;
      s.user = a.payload.user;
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.status = 'failed';
      s.error = a.error.message || 'Login failed';
    });
  },
});

export const { logout, restore } = slice.actions;
export default slice.reducer;
