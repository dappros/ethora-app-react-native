import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';
import type {
  OngoingCallNotification,
  OngoingCallNotificationAction,
} from '@ethora/chat-component-rn';

/**
 * Android ongoing-call notification (foreground service, CallStyle) for the
 * chat SDK's `videoCalls.ongoingCallNotification`. iOS gets the same from
 * CallKit inside the SDK, so this is undefined there.
 */
/** What the user did on the incoming-call notification. */
export type IncomingCallAction = 'answer' | 'open' | 'decline';

type NativeModule = {
  show: (options: Record<string, unknown>) => void;
  hide: () => void;
  showIncomingCall: (options: Record<string, unknown>) => void;
  hideIncomingCall: () => void;
  takeLaunchCall: () => { action: IncomingCallAction; payload: string } | null;
  addListener: {
    (
      event: 'onAction',
      listener: (event: { action: OngoingCallNotificationAction }) => void
    ): { remove: () => void };
    (
      event: 'onIncomingCallAction',
      listener: (event: { action: IncomingCallAction; payload: string }) => void
    ): { remove: () => void };
  };
};

const native =
  Platform.OS === 'android'
    ? requireOptionalNativeModule<NativeModule>('EthoraCallNotification')
    : null;

export const ongoingCallNotification: OngoingCallNotification | undefined = native
  ? {
      show: (state) =>
        native.show({
          title: state.title,
          text: state.text,
          isVideo: state.kind === 'video',
          connectedAt: state.connectedAt ?? 0,
          micOn: state.micOn,
          cameraOn: state.cameraOn,
          hangUpLabel: state.labels.hangUp,
          muteLabel: state.labels.mute,
          unmuteLabel: state.labels.unmute,
          cameraOnLabel: state.labels.cameraOn,
          cameraOffLabel: state.labels.cameraOff,
        }),
      hide: () => native.hide(),
      addActionListener: (listener) => {
        const subscription = native.addListener('onAction', (event) => listener(event.action));
        return () => subscription.remove();
      },
    }
  : undefined;

/**
 * Android incoming call from a data push while the app is in the background
 * or killed: a ringing CallStyle notification with Answer / Decline that
 * opens the app full screen on a locked phone. Called from the push task
 * (`registerSealedPushTask({ onCallPush })` in index.ts).
 */
export const showIncomingCallNotification = (data: Record<string, unknown>): void => {
  if (!native) return;
  const isVideo = String(data.kind ?? '').toLowerCase() === 'video';
  native.showIncomingCall({
    payload: JSON.stringify(data),
    callerName: String(data.callerName || 'Ethora'),
    text: isVideo ? 'Incoming video call' : 'Incoming audio call',
    isVideo,
    channelName: 'Incoming calls',
  });
};

export const hideIncomingCallNotification = (): void => native?.hideIncomingCall();

const parsePayload = (raw: string): Record<string, unknown> | null => {
  try {
    const value = JSON.parse(raw);
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
};

/**
 * Answer / Decline / tap on the incoming-call notification, with the call
 * push it was shown for. The action the app was launched with (cold start)
 * is delivered first.
 */
export const addIncomingCallActionListener = (
  listener: (action: IncomingCallAction, call: Record<string, unknown>) => void
): (() => void) => {
  if (!native) return () => {};
  const deliver = (event: { action: IncomingCallAction; payload: string }) => {
    const call = parsePayload(event.payload);
    if (call) listener(event.action, call);
  };
  const subscription = native.addListener('onIncomingCallAction', deliver);
  const launch = native.takeLaunchCall();
  if (launch) deliver(launch);
  return () => subscription.remove();
};
