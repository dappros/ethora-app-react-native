import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

interface GoogleSignInButtonProps {
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}
export const GoogleSignInButton = ({
  backgroundColor = '#fff',
  textColor = '#013FC4',
  iconColor = '#013FC4',
}: GoogleSignInButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        position: 'relative',
        borderRadius: 15,
        backgroundColor: backgroundColor,
        height: 45,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
      }}
      onPress={() => {}}
    >
      <Ionicons
        color={iconColor}
        size={20}
        name={'logo-google'}
        style={{ position: 'absolute', left: 20 }}
      />
      <Text style={{ color: textColor, fontSize: 15 }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
};
