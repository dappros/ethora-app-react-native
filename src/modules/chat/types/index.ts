import type { ComponentProps, ReactNode } from 'react';
import type { Chat } from '@ethora/chat-component-rn';
import type { ModelApp } from '@modules/config/types';
import type { AuthRefreshResponse, UserType } from '@modules/auth/types';

export type ChatConfig = NonNullable<ComponentProps<typeof Chat>['config']>;
export type ChatUserLoginUser = NonNullable<NonNullable<ChatConfig['userLogin']>['user']>;

export interface CreateChatConfigOptions {
  app: ModelApp | null;
  /** Workspace cluster domain (chat.ethora.com); null → env */
  domain: string | null;
  currentUser: UserType | null;
  tokens: { token: string; refreshToken: string };
  /** Ethora HTTP token refresh; the chat calls it on 401 */
  refresh: () => Promise<AuthRefreshResponse>;
  /** Extra element in the chat header (config.chatHeaderAdditional) */
  headerAdditional?: () => ReactNode;
  /** Called after the full chat teardown (config.logout.onAfterLogout): host auth reset */
  onAfterLogout?: () => Promise<void> | void;
}
