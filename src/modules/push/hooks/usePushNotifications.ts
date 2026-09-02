import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuth } from '@modules/auth/hooks';
import { useConfig } from '@modules/config/hooks';
import { syncPushRegistration } from '@modules/push/service/pushService';

// Foreground policy: while the app is open the XMPP socket is live and the
// chat SDK shows its own in-app notifications (config.inAppNotifications),
// so an OS banner for the same message would be a duplicate. Suppress it.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const extractRoomJid = (response: Notifications.NotificationResponse): string | null => {
  const data = (response.notification.request.content.data ?? {}) as Record<string, unknown>;
  const jid = data.jid || data.chatJid || data.roomJid;
  return typeof jid === 'string' && jid ? jid : null;
};

/**
 * Host-side push lifecycle. Mounted once in the authorized layout:
 *  - registers the native token on the API of the CURRENT domain
 *    (re-registers when the token rotates or domain/app/user change);
 *  - routes notification taps (including cold start) to the chat screen.
 * Unregistering on logout lives in useAuth.logout, not here.
 */
export const usePushNotifications = (): void => {
  const router = useRouter();
  const { token, user } = useAuth();
  const { configApp, domain, status } = useConfig();

  const appId = configApp?._id;
  const userId = user?._id;
  const ready = Boolean(token && userId && appId && domain && status === 'success');

  // Keep the backend registration in sync with (domain, app, user).
  useEffect(() => {
    if (!ready || !domain || !appId || !userId) return;
    syncPushRegistration({ domain, appId, userId });

    // FCM/APNs occasionally rotate the token while the app runs.
    const sub = Notifications.addPushTokenListener(() => {
      syncPushRegistration({ domain, appId, userId });
    });
    return () => sub.remove();
  }, [ready, domain, appId, userId]);

  // Android: channel for message pushes. The backend payload should set
  // channelId: 'messages'; payloads without one land on the OS default.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    }).catch(() => {});
  }, []);

  // Notification taps. For now we land on the chat screen; opening the exact
  // room needs the SDK to expose its pendingNotificationJid entry point
  // (tracked as a follow-up in @ethora/chat-component-rn).
  const handledResponseRef = useRef<string | null>(null);
  useEffect(() => {
    const handle = (response: Notifications.NotificationResponse) => {
      const id = response.notification.request.identifier;
      if (handledResponseRef.current === id) return;
      handledResponseRef.current = id;

      const roomJid = extractRoomJid(response);
      console.log('[push] notification tap', roomJid ?? '(no room jid)');
      router.replace('/(app)/chat');
    };

    // Cold start: the tap that launched the app.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => response && handle(response))
      .catch(() => {});

    const sub = Notifications.addNotificationResponseReceivedListener(handle);
    return () => sub.remove();
  }, [router]);
};
