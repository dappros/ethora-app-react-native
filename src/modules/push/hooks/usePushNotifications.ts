import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuth } from '@modules/auth/hooks';
import { useConfig } from '@modules/config/hooks';
import { syncPushRegistration } from '@modules/push/service/pushService';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const show = AppState.currentState !== 'active';
    return {
      shouldShowBanner: show,
      shouldShowList: show,
      shouldPlaySound: show,
      shouldSetBadge: false,
    };
  },
});

const payloadOf = (response: Notifications.NotificationResponse): Record<string, unknown> =>
  (response.notification.request.content.data ?? {}) as Record<string, unknown>;

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
      vibrationPattern: [0, 250, 250, 250],
    }).catch(() => {});
  }, []);

  const handledResponseRef = useRef<string | null>(null);
  useEffect(() => {
    const handle = (response: Notifications.NotificationResponse) => {
      const id = response.notification.request.identifier;
      if (handledResponseRef.current === id) return;
      handledResponseRef.current = id;

      const data = payloadOf(response);
      console.log('[push] notification tap', data.jid ?? '(no room jid)');
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
