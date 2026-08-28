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
} from 'react-native';

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
  accentColor = '#0052CD',
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = useMemo(() => {
    if (error) return '#B91C1C';
    if (focused) return accentColor;
    return 'transparent';
  }, [error, focused, accentColor]);

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.wrap,
          { borderColor, backgroundColor: focused ? '#fff' : '#E8EDF2' },
          !editable && { opacity: 0.6 },
        ]}
      >
        {left ? <View style={styles.left}>{left}</View> : null}

        <TextInput
          {...inputProps}
          editable={editable}
          style={[styles.input, inputStyle]}
          placeholderTextColor="#8F8F8F"
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
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
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
  },
  left: { marginRight: 10, color: '#0052CD' },
  right: { marginLeft: 10, color: '#8F8F8F' },
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
