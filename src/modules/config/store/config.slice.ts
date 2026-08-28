import { createSlice } from '@reduxjs/toolkit';
import { configSLiceState, ModelApp } from '@modules/config/types';
import { configAppRequest, configDomainRestore, configReset } from '@modules/config/store/config.thunk';

export const initialState: configSLiceState = {
  config: {} as ModelApp,
  domainName: null,
  domain: null,
  status: 'unset',
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(configAppRequest.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(configAppRequest.fulfilled, (state, { payload, meta }) => {
      state.status = 'success';
      state.config = payload;
      state.domainName = meta.arg.domainName;
      state.domain = meta.arg.domain;
    });

    builder.addCase(configAppRequest.rejected, (state, { payload }) => {
      console.log('payload', payload);
      state.status = 'error';
    });

    builder.addCase(configDomainRestore.fulfilled, (state, { payload }) => {
      state.domainName = payload?.domainName ?? null;
      state.domain = payload?.domain ?? null;
    });

    builder.addCase(configReset.fulfilled, () => initialState);
  }
});
