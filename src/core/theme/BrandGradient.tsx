import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { brandGradient } from './brand';

interface BrandGradientProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/** Brand gradient (brand-500 → brand-800, 135°). Use as a background instead of solid blue. */
export const BrandGradient: React.FC<BrandGradientProps> = ({ style, children }) => (
  <LinearGradient
    colors={brandGradient.colors as [string, string]}
    start={brandGradient.start}
    end={brandGradient.end}
    style={style}
  >
    {children}
  </LinearGradient>
);
