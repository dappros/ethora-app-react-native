import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

interface GoogleSignInButtonProps {
  
}
export const GoogleSignInButton = ({}: GoogleSignInButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        position: 'relative',
        borderRadius: 15,
        backgroundColor: '#fff',
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
        color={'#013FC4'}
        size={20}
        name={'logo-google'}
        style={{ position: 'absolute', left: 20 }}
      />
      <Text style={{ color: '#013FC4', fontSize: 15 }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
};
