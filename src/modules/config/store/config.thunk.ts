import { createAsyncThunk } from "@reduxjs/toolkit";
import { getConfig } from "@modules/config/fetch";
import { BaseAsyncThunkOptions } from "@/src/core/types";
import { ModelApp } from "@modules/config/types";


export const configAppRequest = createAsyncThunk<
  ModelApp,
  string | undefined,
  BaseAsyncThunkOptions
>(
  'config/get-config',
  async (domainName, thunkApi) => {
    try {
      const response = await getConfig(domainName);

      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);