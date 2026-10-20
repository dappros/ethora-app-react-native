import { registerSealedPushTask } from '@ethora/chat-component-rn';
import { showIncomingCallNotification } from '@/modules/ethora-call-notification';
import { videoCallsEnabled } from '@modules/chat/config/chatConfig';

// Android: encrypted (sealed) pushes arrive data-only; the SDK's background
// task opens the box with this install's key and shows the notification on
// the `messages` channel, or the silent `reactions` channel for a reaction
// (both created in usePushNotifications). An incoming-call push (also
// data-only) becomes a ringing full-screen call notification instead
// (modules/ethora-call-notification). Runs at module scope from index.ts.
// iOS: no-op — the notification service extension added by the SDK's
// config plugin does the same job there, and calls come as VoIP pushes.
registerSealedPushTask({
  channelId: 'messages',
  reactionChannelId: 'reactions',
  ...(videoCallsEnabled ? { onCallPush: showIncomingCallNotification } : {}),
});
