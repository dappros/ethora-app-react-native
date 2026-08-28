import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { BrandGradient } from '@/src/core/theme';

interface ButtonProps {
  isSubmitting?: boolean;
  isValid?: boolean;
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** Solid color of the active button (custom app primaryColor). Without it — brand gradient. */
  color?: string;
}

const DISABLED = '#8F8F8F';

export const Button: React.FC<ButtonProps> = ({
  isSubmitting,
  isValid,
  onPress,
  title,
  style,
  textStyle,
  color,
}) => {
  const disabled = isSubmitting || !isValid;
  const content = isSubmitting ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={[styles.primaryBtnText, textStyle]}>{title}</Text>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={title}
      style={[styles.submitButton, (disabled || color) && { backgroundColor: disabled ? DISABLED : color }, style]}
    >
      {!disabled && !color ? (
        <BrandGradient style={styles.gradient}>{content}</BrandGradient>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    borderRadius: 15,
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryBtnText: { fontSize: 18, color: '#fff' },
});
