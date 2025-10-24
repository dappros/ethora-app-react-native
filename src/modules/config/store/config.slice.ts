import { createSlice } from '@reduxjs/toolkit';
import { configSLiceState, ModelApp } from '@modules/config/types';
import { configAppRequest } from '@modules/config/store/config.thunk';

export const initialState: configSLiceState = {
  config: {} as ModelApp,
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

    builder.addCase(configAppRequest.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.config = payload;
    });

    builder.addCase(configAppRequest.rejected, (state, { payload }) => {
      console.log('payload', payload);
      state.status = 'error';
    });


    
  }
});
