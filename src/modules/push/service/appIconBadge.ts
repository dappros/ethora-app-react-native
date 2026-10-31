import * as Notifications from 'expo-notifications';
import { roomJidOf } from '@modules/push/lib/notificationPayload';

/**
 * The number on the app icon. While the app runs it mirrors the chat's total
 * unread; while it is closed the backend sets it with each chat push.
 * Best effort, never throws.
 */
export const setAppIconBadge = async (count: number): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(Math.max(0, Math.floor(count)));
  } catch {
    // a badge is decoration: never break the caller over it
  }
};

export const clearAppIconBadge = (): Promise<void> => setAppIconBadge(0);

/**
 * Signed out: nothing of the previous session may stay on the device — no
 * badge and no delivered pushes in the shade / Notification Center.
 * Best effort, never throws.
 */
export const clearAppNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {
    // decoration only
  }
  await clearAppIconBadge();
};

/**
 * Removes the delivered pushes of chats that have nothing unread any more.
 * On Android the launcher counts the notifications in the shade (the push
 * carries the server's total as notificationCount), so a read chat whose push
 * stays in the shade keeps the old number on the icon. On iOS it clears the
 * stale banners from the Notification Center. Best effort, never throws.
 */
export const dismissReadChatNotifications = async (
  unreadByRoom: Record<string, number>
): Promise<void> => {
  try {
    const presented = await Notifications.getPresentedNotificationsAsync();
    const read = presented.filter((notification) => {
      const jid = roomJidOf(notification);
      return jid !== '' && !unreadByRoom[jid];
    });
    await Promise.all(
      read.map((notification) =>
        Notifications.dismissNotificationAsync(notification.request.identifier).catch(() => {})
      )
    );
  } catch {
    // same as the badge: decoration only
  }
};
