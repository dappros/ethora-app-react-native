import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface ButtonProps {
  isSubmitting?: boolean;
  isValid?: boolean;
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  isSubmitting,
  isValid,
  onPress,
  title,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isSubmitting || !isValid}
      accessibilityLabel={title}
      style={[styles.submitButton, { backgroundColor: isSubmitting || !isValid ? '#8F8F8F' : '#0052CD' }, style]}>
      {isSubmitting ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.primaryBtnText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    borderRadius: 15, width: '100%', height: 45,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 20,
  },
  primaryBtnText: { fontSize: 18, color: '#fff' },
  submitButtonText: {
    fontSize: hp('1.5%'),
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
  },
});
