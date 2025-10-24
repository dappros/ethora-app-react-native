import $api from '@modules/auth/interceptors';
import { ModelApp } from '@modules/config/types';

type ApiResponse<T> = { result: T; success?: boolean; message?: string };

export const getConfig = async (domainName?: string): Promise<ModelApp> => {
  const { data } = await $api.get<ApiResponse<ModelApp>>(
    '/apps/get-config',
    { params: domainName ? { domainName } : undefined }
  );

  return data.result;
};
