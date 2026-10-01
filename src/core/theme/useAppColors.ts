import { useColorScheme } from 'react-native';
import { brand } from './brand';
import { darkColors } from './darkColors';

/** Brand-independent colors of the host screens (everything outside the chat). */
export interface AppColors {
  dark: boolean;
  primary: string;
  /** Screen ground */
  background: string;
  /** Cards and sheets over the ground: modals, login sheet */
  surface: string;
  text: string;
  textSecondary: string;
  inputBackground: string;
  inputBackgroundFocused: string;
  inputText: string;
  placeholder: string;
  border: string;
  /** Tinted fill of selected / completed elements */
  highlight: string;
  overlay: string;
  error: string;
}

const LIGHT_COLORS: AppColors = {
  dark: false,
  primary: brand[500],
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  inputBackground: '#E8EDF2',
  inputBackgroundFocused: '#FFFFFF',
  inputText: '#111827',
  placeholder: '#8F8F8F',
  border: '#E8EDF2',
  highlight: '#F0F7FF',
  overlay: 'rgba(0,0,0,0.4)',
  error: '#B91C1C',
};

const DARK_COLORS: AppColors = {
  dark: true,
  primary: darkColors.primary,
  background: darkColors.listBackground,
  surface: darkColors.surface,
  text: darkColors.text,
  textSecondary: darkColors.textSecondary,
  inputBackground: darkColors.surfaceSecondary,
  inputBackgroundFocused: darkColors.surfaceSecondary,
  inputText: darkColors.text,
  placeholder: darkColors.textMuted,
  border: darkColors.border,
  highlight: darkColors.surfaceHighlight,
  overlay: darkColors.overlay,
  error: darkColors.danger,
};

/** The app follows the system appearance (app.json: userInterfaceStyle "automatic"). */
export const useIsDarkTheme = (): boolean => useColorScheme() === 'dark';

export const useAppColors = (): AppColors => (useIsDarkTheme() ? DARK_COLORS : LIGHT_COLORS);
