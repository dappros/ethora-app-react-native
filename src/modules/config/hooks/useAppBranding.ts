import { useMemo } from 'react';
import { ImageSourcePropType } from 'react-native';
import { useAppSelector } from '@/src/store';
import { logoPath } from '@/src/core/docs/config';
import { darkColors, useIsDarkTheme } from '@/src/core/theme';
import { AppBranding } from '@modules/config/types';

const BASE_THEME: AppBranding['theme'] = {
  dark: false,
  background: 'transparent',
  text: '#FFFFFF',
  primary: '#0052CD',
  buttonBackground: '#FFFFFF',
  buttonText: '#013FC4',
  outline: '#FFFFFF',
};

const DEFAULT_PRIMARY = '#0052CD';

const customTheme = (primary: string): AppBranding['theme'] => ({
  dark: false,
  background: '#FFFFFF',
  text: '#0F172A',
  primary,
  buttonBackground: primary,
  buttonText: '#FFFFFF',
  outline: primary,
});

// Base app in the dark theme: the login keeps the branded image and white buttons,
// screens without the image (register) get the dark ground and the light-blue accent
const BASE_DARK_THEME: AppBranding['theme'] = {
  ...BASE_THEME,
  dark: true,
  background: darkColors.listBackground,
  primary: darkColors.primary,
};

// Custom app in the dark theme: colors from the shared dark palette
const darkTheme = (primary: string): AppBranding['theme'] => ({
  dark: true,
  background: darkColors.listBackground,
  text: darkColors.text,
  primary,
  buttonBackground: primary,
  buttonText: darkColors.textOnPrimary,
  outline: primary,
});

export const useAppBranding = (): AppBranding => {
  const config = useAppSelector((store) => store.config.config);
  const status = useAppSelector((store) => store.config.status);
  const dark = useIsDarkTheme();

  return useMemo(() => {
    const isBaseApp = status !== 'success' || config.isBaseApp !== false;
    const displayName = (!isBaseApp && config.displayName) || 'Ethora';
    const logoSource: ImageSourcePropType =
      !isBaseApp && config.logoImage ? { uri: config.logoImage } : logoPath;

    const primary = (!isBaseApp && config.primaryColor) || DEFAULT_PRIMARY;

    const theme = isBaseApp
      ? dark ? BASE_DARK_THEME : BASE_THEME
      : dark ? darkTheme(config.primaryColor || darkColors.primary) : customTheme(primary);

    return {
      isBaseApp,
      displayName,
      logoSource,
      theme,
    };
  }, [config, status, dark]);
};
