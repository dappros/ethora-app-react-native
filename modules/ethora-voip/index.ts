import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

/**
 * iOS VoIP pushes (PushKit). The native side registers PushKit at launch
 * and reports every VoIP push to CallKit itself, before JS runs; this
 * wrapper gives JS the token to register as `apns-voip` and the call
 * payloads to hand to the chat SDK. Android has no VoIP pushes: the call
 * comes as a high-priority data push there. Every function is a no-op
 * off iOS and in a build without the module.
 */

/** Call fields of a VoIP push, as the backend sends them, plus the CallKit UUID. */
export type VoipCallPayload = Record<string, string> & { callKitUuid: string };

type NativeModule = {
  getToken: () => string | null;
  takePendingCalls: () => VoipCallPayload[];
  addListener: {
    (event: 'onToken', listener: (event: { token: string | null }) => void): { remove: () => void };
    (event: 'onIncomingCall', listener: (event: VoipCallPayload) => void): { remove: () => void };
  };
};

const native =
  Platform.OS === 'ios' ? requireOptionalNativeModule<NativeModule>('EthoraVoip') : null;

export const voipAvailable = native !== null;

/** PushKit token (hex), null until iOS issued one. */
export const getVoipToken = (): string | null => native?.getToken() ?? null;

export const addVoipTokenListener = (listener: (token: string | null) => void): (() => void) => {
  if (!native) return () => {};
  const subscription = native.addListener('onToken', (event) => listener(event.token));
  return () => subscription.remove();
};

/**
 * Incoming calls from VoIP pushes, already on the CallKit screen. The ones
 * that came in before this listener (the push started the app) are
 * delivered first.
 */
export const addVoipCallListener = (listener: (call: VoipCallPayload) => void): (() => void) => {
  if (!native) return () => {};
  const subscription = native.addListener('onIncomingCall', listener);
  for (const call of native.takePendingCalls()) listener(call);
  return () => subscription.remove();
};
