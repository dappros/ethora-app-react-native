import $api from '@modules/auth/interceptors';
import { ModelApp, Workspace } from '@modules/config/types';
import { apiBaseUrl } from '@modules/config/utils/workspace';

type ApiResponse<T> = { result: T; success?: boolean; message?: string };

/** GET https://api.[domain]/v1/apps/get-config?domainName=[domainName] */
export const getConfig = async ({ domainName, domain }: Workspace): Promise<ModelApp> => {
  const { data } = await $api.get<ApiResponse<ModelApp>>('/apps/get-config', {
    baseURL: apiBaseUrl(domain),
    params: { domainName },
  });

  return data.result;
};
