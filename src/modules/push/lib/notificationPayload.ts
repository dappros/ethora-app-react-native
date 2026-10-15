import * as Notifications from 'expo-notifications';

/**
 * Custom keys of a chat push (`jid`, `msgID`, ...) wherever the platform put
 * them: iOS keeps the raw APNs payload on the trigger, Android the FCM data
 * on `content.data`.
 */
export const payloadOf = (notification: Notifications.Notification): Record<string, unknown> => {
  const request = notification.request;
  const data = (request.content.data ?? {}) as Record<string, unknown>;
  const trigger = request.trigger as { type?: string; payload?: unknown } | null;
  const raw =
    trigger?.type === 'push' && trigger.payload && typeof trigger.payload === 'object'
      ? (trigger.payload as Record<string, unknown>)
      : {};
  const body =
    raw.body && typeof raw.body === 'object' ? (raw.body as Record<string, unknown>) : {};
  return { ...raw, ...body, ...data };
};

/** Room JID of a chat push, '' for anything else (calls, broadcasts). */
export const roomJidOf = (notification: Notifications.Notification): string => {
  const jid = payloadOf(notification).jid;
  return typeof jid === 'string' ? jid.trim() : '';
};
