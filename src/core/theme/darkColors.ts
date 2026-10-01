import type { ChatThemeOverrides } from '@ethora/chat-component-rn';

/**
 * Dark palette of the app. Single source of truth: passed to the chat as
 * `config.darkColors` and used by the host screens (domain / login / register).
 * icon / senderName / dateLabel are left out on purpose — the chat derives them from `primary`.
 */
export const darkColors = {
  primary: '#4C8DFF',
  secondary: '#F2F4F7',

  listBackground: '#0F1216',
  chatBackground: '#141A21',
  surface: '#1C2430',
  surfaceSecondary: '#26303D',
  surfaceHighlight: '#4C8DFF26',

  text: '#F2F4F7',
  textSecondary: '#A0A8B3',
  textMuted: '#7A8391',
  textOnPrimary: '#FFFFFF',

  border: '#2F3A47',
  divider: '#2F3A47',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',

  messageBackground: '#1F2833',
  messageBackgroundUser: '#1E3A5F',
  messageText: '#F2F4F7',
  messageTextUser: '#F2F4F7',
  systemMessageBackground: '#26303D',

  danger: '#F87171',
  success: '#4ADE80',
} satisfies ChatThemeOverrides;
