import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { handlePushPayload } from '@ethora/chat-component-rn';
import { useAuth } from '@modules/auth/hooks';
import { useConfig } from '@modules/config/hooks';
import { syncPushRegistration } from '@modules/push/service/pushService';
import { useAppIconBadge } from '@modules/push/hooks/useAppIconBadge';
import { useIncomingCallPushes } from '@modules/push/hooks/useIncomingCallPushes';
import { payloadOf } from '@modules/push/lib/notificationPayload';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const show = AppState.currentState !== 'active';
    return {
      shouldShowBanner: show,
      shouldShowList: show,
      shouldPlaySound: show,
      // In the foreground useAppIconBadge owns the number (the app knows what
      // the user has just read, the server may not yet).
      shouldSetBadge: show,
    };
  },
});

/**
 * Host-side push lifecycle. Mounted once in the authorized layout:
 *  - registers the native token on the API of the CURRENT domain
 *    (re-registers when the token rotates or domain/app/user change);
 *  - routes notification taps (including cold start) to the chat screen;
 *  - keeps the app-icon badge equal to the total unread;
 *  - incoming calls by push (iOS VoIP token + CallKit, Android call notification).
 * Unregistering on logout lives in useAuth.logout, not here.
 */
export const usePushNotifications = (): void => {
  const router = useRouter();
  const { token, user } = useAuth();
  const { configApp, domain, status } = useConfig();

  const appId = configApp?._id;
  const userId = user?._id;
  const ready = Boolean(token && userId && appId && domain && status === 'success');

  useAppIconBadge(token ? userId : undefined);

  // Incoming calls by push: iOS VoIP (PushKit + CallKit), Android call notification.
  useIncomingCallPushes(ready && domain && appId && userId ? { domain, appId, userId } : null);

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
    // Reactions to the user's messages come in silent, the way Telegram
    // does it; the service sends them with channelId 'reactions'.
    Notifications.setNotificationChannelAsync('reactions', {
      name: 'Reactions',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: null,
      enableVibrate: false,
    }).catch(() => {});
  }, []);

  const handledResponseRef = useRef<string | null>(null);
  useEffect(() => {
    const handle = (response: Notifications.NotificationResponse) => {
      const id = response.notification.request.identifier;
      if (handledResponseRef.current === id) return;
      handledResponseRef.current = id;

      const data = payloadOf(response.notification);
      const outcome = handlePushPayload(data);
      console.log('[push] notification tap →', outcome, data.jid ?? '');
      router.replace('/(app)/chat');
    };

    // Cold start: the tap that launched the app. Read from the native cache
    // synchronously — it survives a JS restart (dev-client reload, a second
    // bundle load right after the tap) that the async variant lost.
    try {
      const last = Notifications.getLastNotificationResponse();
      if (last) {
        handle(last);
        // One tap = one open: the native side otherwise keeps replaying this
        // response to every later mount.
        Notifications.clearLastNotificationResponse();
      }
    } catch {}

    const sub = Notifications.addNotificationResponseReceivedListener(handle);
    return () => sub.remove();
  }, [router]);
};
