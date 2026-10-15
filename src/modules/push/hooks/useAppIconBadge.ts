import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useUnread } from '@ethora/chat-component-rn';
import { dismissReadChatNotifications, setAppIconBadge } from '@modules/push/service/appIconBadge';

// Fallback for a session whose unread sync is never observed (the SDK had
// already loaded when this hook mounted).
const FIRST_SYNC_TIMEOUT_MS = 15000;

interface SessionSync {
  key: string | undefined;
  sawLoading: boolean;
  synced: boolean;
}

/**
 * Keeps the app-icon badge equal to the chat's total unread while the app
 * runs, and removes the pushes of chats that were read.
 *
 * Waits only for the FIRST unread sync of a session (`sessionKey`, the user
 * id), so the icon does not blink to 0 before the counts arrive. After that
 * the SDK's loading flag is ignored: it is shared by every room and goes up
 * again on each room open and background history page, which swallowed the
 * update for what the user had just read.
 */
export const useAppIconBadge = (sessionKey: string | undefined): void => {
  const { totalCount, unreadByRoom, isLoading } = useUnread();
  const [session, setSession] = useState<SessionSync>({
    key: sessionKey,
    sawLoading: false,
    synced: false,
  });

  // Derived during render (React's "adjust state when a prop changes"): a
  // short loading flash between two effects would otherwise be missed.
  let next =
    session.key === sessionKey ? session : { key: sessionKey, sawLoading: false, synced: false };
  if (sessionKey) {
    const sawLoading = next.sawLoading || isLoading;
    const syncedNow = next.synced || (!isLoading && (sawLoading || totalCount > 0));
    if (sawLoading !== next.sawLoading || syncedNow !== next.synced) {
      next = { ...next, sawLoading, synced: syncedNow };
    }
  }
  if (next !== session) setSession(next);

  useEffect(() => {
    if (!sessionKey) return;
    const timer = setTimeout(() => {
      setSession((prev) =>
        prev.key === sessionKey && !prev.synced ? { ...prev, synced: true } : prev
      );
    }, FIRST_SYNC_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [sessionKey]);

  const synced = !!sessionKey && next.synced;

  // unreadByRoom is a new object on every store change; the key string only
  // changes when a room's count does.
  const roomsKey = Object.entries(unreadByRoom)
    .map(([jid, count]) => `${jid}:${count}`)
    .sort()
    .join('|');

  const latestRef = useRef({ totalCount, unreadByRoom, synced });
  useEffect(() => {
    latestRef.current = { totalCount, unreadByRoom, synced };
  });

  useEffect(() => {
    if (!synced) return;
    if (__DEV__) console.log('[badge] total unread', totalCount);
    setAppIconBadge(totalCount);
    dismissReadChatNotifications(latestRef.current.unreadByRoom);
  }, [synced, totalCount, roomsKey]);

  // A push that arrived while the app was in the background set the server's
  // number; once back in front the app's own count wins again.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      const latest = latestRef.current;
      if (state !== 'active' || !latest.synced) return;
      setAppIconBadge(latest.totalCount);
      dismissReadChatNotifications(latest.unreadByRoom);
    });
    return () => sub.remove();
  }, []);
};
