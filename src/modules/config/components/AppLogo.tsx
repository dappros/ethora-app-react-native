import { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { YOU_LOGO_XML } from './youLogo';

interface AppLogoProps {
  /** null — the app has no logo of its own: draw the default YouLogo */
  source: ImageSourcePropType | null;
  style?: StyleProp<ImageStyle>;
}

// App logo from useAppBranding; when there is none, or the logoImage URL fails to load, YouLogo is shown
export const AppLogo = ({ source, style }: AppLogoProps) => {
  const [failed, setFailed] = useState(false);

  // A new logo URL gets a fresh try
  useEffect(() => setFailed(false), [source]);

  if (!source || failed) {
    const { width, height, ...rest } = StyleSheet.flatten(style) ?? {};
    return (
      <View
        accessibilityLabel="App logo"
        style={[rest, { width, height, alignItems: 'center', justifyContent: 'center' }]}
      >
        <SvgXml xml={YOU_LOGO_XML} width="100%" height="100%" />
      </View>
    );
  }

  return (
    <Image
      alt="App logo"
      accessibilityLabel="App logo"
      source={source}
      resizeMode="contain"
      style={style}
      onError={() => setFailed(true)}
    />
  );
};
