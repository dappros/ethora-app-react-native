import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'expo-router';
import {
  answerCallFromPush,
  declineCallFromPush,
  handlePushPayload,
} from '@ethora/chat-component-rn';
import { addVoipCallListener, addVoipTokenListener, voipAvailable } from '@/modules/ethora-voip';
import { addIncomingCallActionListener } from '@/modules/ethora-call-notification';
import { syncVoipRegistration } from '@modules/push/service/voipPushService';
import type { PushTarget } from '@modules/push/service/pushService';

/**
 * Incoming calls that came by push, host side. The SDK rings them into its
 * store (holding them until <Chat> is up after a cold start); this hook
 * hands them over and opens the chat screen, where the SDK's call UI lives.
 *
 *  - iOS: VoIP pushes. The call is already on the CallKit screen when JS
 *    hears about it (reported natively in modules/ethora-voip); the SDK
 *    adopts that CallKit call. Also keeps the `apns-voip` registration in
 *    step with the PushKit token.
 *  - Android: Answer / Decline / tap on the incoming-call notification the
 *    push task showed (modules/ethora-call-notification).
 */
export const useIncomingCallPushes = (target: PushTarget | null): void => {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const domain = target?.domain;
  const appId = target?.appId;
  const userId = target?.userId;

  useEffect(() => {
    if (!voipAvailable || !domain || !appId || !userId) return;
    const sync = () => syncVoipRegistration({ domain, appId, userId });
    sync();
    // PushKit hands the token over a moment after launch, and may rotate it.
    return addVoipTokenListener(sync);
  }, [domain, appId, userId]);

  useEffect(() => {
    const openChat = () => {
      if (pathnameRef.current !== '/chat') router.replace('/(app)/chat');
    };

    const removeVoip = addVoipCallListener((call) => {
      const outcome = handlePushPayload(call);
      console.log('[push] VoIP call →', outcome, call.callId ?? '', call.kind ?? '');
      openChat();
    });

    const removeAndroid = addIncomingCallActionListener((action, call) => {
      console.log('[push] call notification →', action, String(call.callId ?? ''));
      if (action === 'decline') {
        declineCallFromPush(call);
        return;
      }
      if (action === 'answer') answerCallFromPush(call);
      else handlePushPayload(call);
      openChat();
    });

    return () => {
      removeVoip();
      removeAndroid();
    };
  }, [router]);
};
