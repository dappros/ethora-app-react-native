import { useMemo } from 'react';
import { ImageSourcePropType } from 'react-native';
import { useAppSelector } from '@/src/store';
import { logoPath } from '@/src/core/docs/config';
import { AppBranding } from '@modules/config/types';

const BASE_THEME: AppBranding['theme'] = {
  background: 'transparent',
  text: '#FFFFFF',
  primary: '#0052CD',
  buttonBackground: '#FFFFFF',
  buttonText: '#013FC4',
  outline: '#FFFFFF',
};

const DEFAULT_PRIMARY = '#0052CD';

const customTheme = (primary: string): AppBranding['theme'] => ({
  background: '#FFFFFF',
  text: '#0F172A',
  primary,
  buttonBackground: primary,
  buttonText: '#FFFFFF',
  outline: primary,
});

export const useAppBranding = (): AppBranding => {
  const config = useAppSelector((store) => store.config.config);
  const status = useAppSelector((store) => store.config.status);

  return useMemo(() => {
    const isBaseApp = status !== 'success' || config.isBaseApp !== false;
    const displayName = (!isBaseApp && config.displayName) || 'Ethora';
    const logoSource: ImageSourcePropType =
      !isBaseApp && config.logoImage ? { uri: config.logoImage } : logoPath;

    const primary = (!isBaseApp && config.primaryColor) || DEFAULT_PRIMARY;

    return {
      isBaseApp,
      displayName,
      logoSource,
      theme: isBaseApp ? BASE_THEME : customTheme(primary),
    };
  }, [config, status]);
};
