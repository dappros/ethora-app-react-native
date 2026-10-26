import { registerSealedPushTask } from '@ethora/chat-component-rn';
import { showIncomingCallNotification } from '@/modules/ethora-call-notification';
import { showSenderAvatar } from '@/modules/ethora-message-notification';
import { videoCallsEnabled } from '@modules/chat/config/chatConfig';

// Android: encrypted (sealed) pushes arrive data-only; the SDK's background
// task opens the box with this install's key and shows the notification on
// the `messages` channel, or the silent `reactions` channel for a reaction
// (both created in usePushNotifications). An incoming-call push (also
// data-only) becomes a ringing full-screen call notification instead
// (modules/ethora-call-notification). A push with the sender's avatar is
// redrawn with it next to the text, the way messengers show it
// (modules/ethora-message-notification); the push service leaves the avatar
// out when the app switched it off. Runs at module scope from index.ts.
// iOS: no-op — the notification service extension added by the SDK's
// config plugin does the same job there, and calls come as VoIP pushes.
registerSealedPushTask({
  channelId: 'messages',
  reactionChannelId: 'reactions',
  onMessageShown: showSenderAvatar,
  ...(videoCallsEnabled ? { onCallPush: showIncomingCallNotification } : {}),
});
