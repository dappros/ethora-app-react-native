import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';
import type { ShownMessagePush } from '@ethora/chat-component-rn';

type NativeModule = {
  showSenderAvatar: (options: Record<string, unknown>) => Promise<boolean>;
};

const native =
  Platform.OS === 'android'
    ? requireOptionalNativeModule<NativeModule>('EthoraMessageNotification')
    : null;

export const showSenderAvatar = async (shown: ShownMessagePush): Promise<void> => {
  if (!native) return;
  await native.showSenderAvatar({
    identifier: shown.identifier,
    title: shown.title,
    body: shown.body,
    sender: shown.sender,
    senderJid: shown.senderJid,
    chatJid: shown.chatJid,
    image: shown.image,
  });
};
