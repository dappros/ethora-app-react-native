import { RequestStatus } from '@/src/core/types';
import { ModelApp } from '@modules/config/types';

export interface configSLiceState {
  config: ModelApp;
  status: RequestStatus;
}