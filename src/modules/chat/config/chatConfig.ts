import { ChatConfig, ChatUserLoginUser, CreateChatConfigOptions } from '@modules/chat/types';
import { apiBaseUrl, xmppHostFor, xmppSettingsFor } from '@modules/config/utils/workspace';
import { DEFAULT_API_DOMAIN } from '@modules/config/constants';
import { darkColors } from '@/src/core/theme';

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
  dark = false,
  refresh,
  headerAdditional,
  onAfterLogout,
  onThemeChange,
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
          return {
            accessToken: rotated.token,
            refreshToken: rotated.refreshToken,
            xmppPassword: rotated.xmppPassword,
            fileToken: rotated.fileToken,
          };
        } catch {
          return null;
        }
      },
    },
    headerLayout: { safeAreaTop: true },
    initBeforeLoad: Boolean(userLoginPayload),
    newArch: true,
    colors: {
      primary: app?.primaryColor || DEFAULT_PRIMARY,
      secondary: SECONDARY,
    },
    // Dark theme: `colors` is ignored by the chat in dark mode, the palette comes from darkColors.
    // A custom app keeps its brand primary, the base app uses the palette default.
    dark,
    darkColors: {
      ...darkColors,
      primary: (app?.isBaseApp === false && app.primaryColor) || darkColors.primary,
    },
    chatHeaderSettings: {
      disableMenu: true,
      disableCreate: app?.allowUsersToCreateRooms === false,
    },
    defaultRooms: app?.defaultRooms || [],
    chatHeaderAdditional: headerAdditional ? { enabled: true, element: headerAdditional } : undefined,
    // "Sign out" item in the room-list right menu: the library performs performLogout itself,
    // then calls onAfterLogout — we reset the auth store there and (app)/_layout redirects to /login.
    // No label/confirm copy here: the library's own follows the app language.
    logout: {
      enabled: true,
      confirm: true,
      onAfterLogout,
    },
    enableRoomsRetry: { enabled: false, helperText: '' },
    inAppNotifications: { enabled: true, showInContext: true },
    eventHandlers: onThemeChange ? { onThemeChange } : undefined,
    e2ee: { enabled: true },
    // Settings → Language: the interface language (user.appLanguage) and the
    // language messages are translated into (user.chatLanguage), both kept on
    // the profile. Translation itself is the server's, shown inline ("auto").
    settings: { languages: { enabled: true }, changePassword: true },
    translates: { enabled: true, mode: 'auto' },
    // Search in the room list also matches message text across all chats
    // (WhatsApp-style "Messages" section). The archive it queries is scoped
    // by app, so the library needs the appId alongside the flag.
    enableMessageSearch: true,
    appId: currentUser?.appId,
  };

  if (userLoginPayload) {
    config.userLogin = { enabled: true, user: userLoginPayload };
  }

  return config;
};
