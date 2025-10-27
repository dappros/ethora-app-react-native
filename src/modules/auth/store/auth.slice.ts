import { createSlice } from '@reduxjs/toolkit';
import { authCheckRequest, authLoginRequest, authRegistrationRequest, autRefreshRequest } from '@modules/auth/store/auth.thunk';
import { AuthSLiceState, UserType } from '@modules/auth//types';
import { tokenStorage } from '@/src/core/lib/tokenStorage';

export const initialState: AuthSLiceState = {
  user: {} as UserType,
  status: 'unset',
  checked: false,
  rememberMe: false,
  token: '',
  refreshToken: '',
  eventToken: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLogout: (state) => {
      Object.assign(state, initialState);

      tokenStorage.clear();
    },
    setToken: (state, { payload }) => {
      state.token = payload.token;
    }
  },
  extraReducers: (builder) => {
    // LOGIN________________
    builder.addCase(authLoginRequest.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(authLoginRequest.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.checked = true;
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
      state.user = payload.user;

      const tokensAll = {
        token: payload.token,
        refreshToken: payload.refreshToken,
        wsToken: payload.wsToken,
      }

      tokenStorage.setAll(tokensAll);
    });

    builder.addCase(authLoginRequest.rejected, (state, { payload }) => {
      console.log('payload', payload);
      state.status = 'error';
    });

    // REGISTRATION________________
    builder.addCase(authRegistrationRequest.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(authRegistrationRequest.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.checked = true;
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
      state.user = payload.user;

      const tokensAll = {
        token: payload.token,
        refreshToken: payload.refreshToken,
        wsToken: payload.wsToken,
      }

      tokenStorage.setAll(tokensAll);
    });

    builder.addCase(authRegistrationRequest.rejected, (state, { payload }) => {
      console.log('payload', payload);
      state.status = 'error';
    });


    // Check________________
    builder.addCase(authCheckRequest.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(authCheckRequest.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.checked = true;
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
      state.user = payload.user;

      const tokensAll = {
        token: payload.token,
        refreshToken: payload.refreshToken,
        wsToken: payload.wsToken,
      }

      tokenStorage.setAll(tokensAll);
    });

    builder.addCase(authCheckRequest.rejected, (state) => {
      state.status = 'error';
    });

    // Check ________________
    builder.addCase(autRefreshRequest.pending, (state) => {
      state.status = 'loading';
    });
     builder.addCase(autRefreshRequest.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;

      const tokensAll = {
        token: payload.token,
        refreshToken: payload.refreshToken,
        wsToken: payload.wsToken,
      }

      tokenStorage.setAll(tokensAll);
    });
     builder.addCase(autRefreshRequest.rejected, (state) => {
      state.status = 'error';
    });

  }
});

export const { authLogout, setToken } = authSlice.actions;