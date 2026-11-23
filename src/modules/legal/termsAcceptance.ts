import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { TERMS_OF_USE } from './termsOfUse';

const KEY = 'termsOfUseAccepted';

let accepted: boolean | null = null;
const listeners = new Set<() => void>();

const set = (value: boolean) => {
  accepted = value;
  listeners.forEach((listener) => listener());
};

export const loadTermsAcceptance = async () => {
  try {
    set((await AsyncStorage.getItem(KEY)) === TERMS_OF_USE.version);
  } catch {
    set(false);
  }
};

export const acceptTerms = async () => {
  set(true);
  await AsyncStorage.setItem(KEY, TERMS_OF_USE.version).catch(() => {});
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useTermsAccepted = () => useSyncExternalStore(subscribe, () => accepted);
