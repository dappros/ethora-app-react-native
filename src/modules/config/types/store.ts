import { RequestStatus } from '@/src/core/types';
import { ModelApp } from '@modules/config/types';

/** Workspace: app stub + cluster domain (api.[domain]) */
export interface Workspace {
  domainName: string;
  domain: string;
}

export interface configSLiceState {
  config: ModelApp;
  domainName: string | null;
  domain: string | null;
  status: RequestStatus;
}
