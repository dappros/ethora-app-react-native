import { useCallback, useMemo } from 'react';
import { useAppDispatch } from '@/src/store';
import { authSlice } from '@modules/auth/store';
import { useAuth } from '@modules/auth/hooks';
import { useConfig } from '@modules/config/hooks';
import { createChatConfig } from '@modules/chat/config/chatConfig';
import { ChatConfig } from '@modules/chat/types';
import { useIsDarkTheme } from '@/src/core/theme';

export const useChatConfig = (): ChatConfig => {
  const { configApp, domain } = useConfig();
  const { user, token, refreshToken, refresh } = useAuth();
  const dispatch = useAppDispatch();
  const dark = useIsDarkTheme();

  // The chat already ran performLogout — only the host auth (tokens + store) is left to reset
  const onAfterLogout = useCallback(() => {
    dispatch(authSlice.actions.authLogout());
  }, [dispatch]);

  const userId = user?._id;
  const xmppUsername = user?.xmppUsername;
  const hasXmppPassword = Boolean(user?.xmppPassword);

  return useMemo(
    () =>
      createChatConfig({
        app: configApp,
        domain,
        currentUser: user,
        tokens: { token, refreshToken },
        dark,
        refresh,
        onAfterLogout,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configApp, domain, dark, onAfterLogout, userId, xmppUsername, hasXmppPassword, refresh]
  );
};
