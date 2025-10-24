import { RootState } from '@/src/store';

export type RequestStatus = 'loading' | 'success' | 'error' | 'unset';

export interface ErrorType {
  message: string;
  name: string;
  fields?: Record<string, string[]>;
}

export interface BaseAsyncThunkOptions<E = unknown, S = RootState> {
  rejectValue: E;
  state: S;
}