import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@modules/auth/hooks';
import { useAppSelector } from '@/src/store';
import { isGoogleSignInConfigured } from '@modules/auth/lib/googleSignIn';

interface GoogleSignInButtonProps {
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  /** Passed to the social sign-up as `utm` for new accounts */
  utm?: string;
}

/**
 * Google is offered when the build has Google OAuth clients and the workspace lists it
 * in signonOptions (same gate as the web LoginForm). Before the config is loaded the
 * button stays visible.
 */
export const useGoogleSignInAvailable = (): boolean => {
  const signonOptions = useAppSelector((store) => store.config.config.signonOptions);
  if (!isGoogleSignInConfigured()) return false;
  return !Array.isArray(signonOptions) || signonOptions.includes('google');
};

export const GoogleSignInButton = ({
  backgroundColor = '#fff',
  textColor = '#013FC4',
  iconColor = '#013FC4',
  utm = 'mobile-app',
}: GoogleSignInButtonProps) => {
  const { loginWithGoogle } = useAuth();
  const available = useGoogleSignInAvailable();
  const [busy, setBusy] = useState(false);

  if (!available) return null;

  const onPress = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await loginWithGoogle({ utm });
      router.replace('/(app)/chat');
    } catch (error: any) {
      if (error?.name === 'GoogleSignInCancelled') return;
      console.log('Google sign-in error:', error);
      const message =
        error?.name === 'GoogleRegistrationClosed'
          ? 'There is no account for this Google email and registration is closed for this workspace.'
          : error?.response?.data?.error ||
            error?.response?.data?.message ||
            'Could not sign in with Google. Please try again.';
      Alert.alert('Google sign-in', message);
    } finally {
      setBusy(false);
    }
  };

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
        opacity: busy ? 0.7 : 1,
      }}
      onPress={onPress}
      disabled={busy}
      accessibilityLabel="Sign in with Google"
    >
      {busy ? (
        <ActivityIndicator color={iconColor} style={{ position: 'absolute', left: 20 }} />
      ) : (
        <Ionicons
          color={iconColor}
          size={20}
          name={'logo-google'}
          style={{ position: 'absolute', left: 20 }}
        />
      )}
      <Text style={{ color: textColor, fontSize: 15 }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
};
