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
type NativeModule = {
  show: (options: Record<string, unknown>) => void;
  hide: () => void;
  addListener: (
    event: 'onAction',
    listener: (event: { action: OngoingCallNotificationAction }) => void
  ) => { remove: () => void };
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


