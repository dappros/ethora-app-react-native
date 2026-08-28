import { ChatConfig, ChatUserLoginUser, CreateChatConfigOptions } from '@modules/chat/types';
import { apiBaseUrl, xmppHostFor, xmppSettingsFor } from '@modules/config/utils/workspace';
import { DEFAULT_API_DOMAIN } from '@modules/config/constants';

const DEFAULT_PRIMARY = '#0052CD';
const SECONDARY = '#141414';

export const makeChatUserLogin = (
  user: CreateChatConfigOptions['currentUser'],
  tokens: CreateChatConfigOptions['tokens']
): ChatUserLoginUser | null => {
  if (!user) return null;
  const xmppUsername = user.xmppUsername || '';
  const xmppPassword = user.xmppPassword || '';
  if (!xmppUsername || !xmppPassword) return null;

  const walletAddress = user.defaultWallet?.walletAddress || '';

  return {
    _id: user._id,
    appId: user.appId,
    xmppUsername,
    xmppPassword,
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    profileImage: user.profileImage || '',
    description: user.description || '',
    walletAddress,
    defaultWallet: { walletAddress },
  } as ChatUserLoginUser;
};

export const createChatConfig = ({
  app,
  domain,
  currentUser,
  tokens,
  refresh,
  headerAdditional,
  onAfterLogout,
}: CreateChatConfigOptions): ChatConfig => {
  const userLoginPayload = makeChatUserLogin(currentUser, tokens);
  const apiDomain = domain || DEFAULT_API_DOMAIN;
  const xmppHost = app?.xmppHost || xmppHostFor(apiDomain);

  const config: ChatConfig = {
    baseUrl: apiBaseUrl(apiDomain),
    customAppToken: app?.appToken,
    xmppSettings: xmppSettingsFor(xmppHost),
    refreshTokens: {
      enabled: true,
      refreshFunction: async () => {
        try {
          const rotated = await refresh();
          return { accessToken: rotated.token, refreshToken: rotated.refreshToken };
        } catch {
          return null;
        }
      },
    },
    initBeforeLoad: Boolean(userLoginPayload),
    newArch: true,
    colors: {
      primary: app?.primaryColor || DEFAULT_PRIMARY,
      secondary: SECONDARY,
    },
    chatHeaderSettings: {
      disableMenu: true,
      disableCreate: app?.allowUsersToCreateRooms === false,
    },
    defaultRooms: app?.defaultRooms || [],
    chatHeaderAdditional: headerAdditional ? { enabled: true, element: headerAdditional } : undefined,
    // "Sign out" item in the room-list right menu: the library performs performLogout itself,
    // then calls onAfterLogout — we reset the auth store there and (app)/_layout redirects to /login
    logout: {
      enabled: true,
      label: 'Sign out',
      confirm: {
        title: 'Sign out?',
        message: 'You will need to log in again to access your chats.',
        confirmText: 'Sign out',
        cancelText: 'Cancel',
      },
      onAfterLogout,
    },
    enableRoomsRetry: { enabled: false, helperText: '' },
    inAppNotifications: { enabled: true, showInContext: true },
  };

  if (userLoginPayload) {
    config.userLogin = { enabled: true, user: userLoginPayload };
  }

  return config;
};
