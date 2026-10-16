import { registerSealedPushTask } from '@ethora/chat-component-rn';

// Android: encrypted (sealed) pushes arrive data-only; the SDK's background
// task opens the box with this install's key and shows the notification on
// the `messages` channel (created in usePushNotifications). Runs at module
// scope from index.ts. iOS: no-op — the notification service extension
// added by the SDK's config plugin does the same job there.
registerSealedPushTask({ channelId: 'messages' });
