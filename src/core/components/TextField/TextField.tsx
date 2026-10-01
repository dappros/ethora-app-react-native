import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Pressable,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useAppColors } from '@/src/core/theme';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'onChange'> & {
  label?: string;
  hint?: string; 
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  onRightPress?: () => void;
  /** Focused border color (brand blue by default) */
  accentColor?: string;
};

export const TextField: React.FC<TextFieldProps> = ({
  label,
  hint,
  error,
  left,
  right,
  onRightPress,
  containerStyle,
  inputStyle,
  editable = true,
  accentColor,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);
  const colors = useAppColors();
  const accent = accentColor ?? colors.primary;

  const borderColor = useMemo(() => {
    if (error) return colors.error;
    if (focused) return accent;
    return 'transparent';
  }, [error, focused, accent, colors.error]);

  return (
    <View style={containerStyle}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}

      <View
        style={[
          styles.wrap,
          {
            borderColor,
            backgroundColor: focused ? colors.inputBackgroundFocused : colors.inputBackground,
          },
          !editable && { opacity: 0.6 },
        ]}
      >
        {left ? <View style={styles.left}>{left}</View> : null}

        <TextInput
          {...inputProps}
          editable={editable}
          style={[styles.input, { color: colors.inputText }, inputStyle]}
          placeholderTextColor={colors.placeholder}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
        />

        {(right || onRightPress) ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={8}
            style={styles.right}
            disabled={!onRightPress}
          >
            {right}
          </Pressable>
        ) : null}
      </View>

      {!!error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    color: '#0F172A',
    fontSize: 14,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
    ...Platform.select({
      android: { paddingVertical: 0, includeFontPadding: false, textAlignVertical: 'center' },
    }),
  },
  // Fixed-width slots: icons of different glyph widths keep the text aligned across fields
  left: { width: 22, alignItems: 'center', marginRight: 10 },
  right: { width: 22, alignItems: 'center', marginLeft: 10 },
  error: {
    color: '#B91C1C',
    marginTop: 6,
    fontSize: 13,
  },
  hint: {
    color: '#64748B',
    marginTop: 6,
    fontSize: 13,
  },
});
