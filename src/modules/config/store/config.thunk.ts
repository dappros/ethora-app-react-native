import { createAsyncThunk } from "@reduxjs/toolkit";
import { getConfig } from "@modules/config/fetch";
import { BaseAsyncThunkOptions } from "@/src/core/types";
import { ModelApp, Workspace } from "@modules/config/types";
import { domainStorage } from "@/src/core/lib/domainStorage";


export const configAppRequest = createAsyncThunk<
  ModelApp,
  Workspace,
  BaseAsyncThunkOptions
>(
  'config/get-config',
  async (workspace, thunkApi) => {
    try {
      const response = await getConfig(workspace);
      await domainStorage.set(workspace);

      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const configDomainRestore = createAsyncThunk<
  Workspace | null,
  undefined,
  BaseAsyncThunkOptions
>(
  'config/restore-domain',
  async () => {
    return domainStorage.get();
  }
);

export const configReset = createAsyncThunk<void, undefined, BaseAsyncThunkOptions>(
  'config/reset',
  async () => {
    await domainStorage.clear();
  }
);
