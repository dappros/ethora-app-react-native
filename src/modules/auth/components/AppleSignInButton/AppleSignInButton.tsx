import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@modules/auth/hooks';
import { useAppSelector } from '@/src/store';
import { isAppleSignInAvailable } from '@modules/auth/lib/appleSignIn';
import { useGoogleSignInAvailable } from '../GoogleSignInButton';

interface AppleSignInButtonProps {
  /** Passed to the social sign-up as `utm` for new accounts */
  utm?: string;
}

/**
 * Sign in with Apple is offered on iOS wherever Google is (App Review guideline 4.8), and
 * also when the workspace lists 'apple' in signonOptions.
 */
export const useAppleSignInAvailable = (): boolean => {
  const signonOptions = useAppSelector((store) => store.config.config.signonOptions);
  const googleAvailable = useGoogleSignInAvailable();
  const [deviceSupports, setDeviceSupports] = useState(false);

  useEffect(() => {
    let alive = true;
    isAppleSignInAvailable().then((value) => alive && setDeviceSupports(value));
    return () => {
      alive = false;
    };
  }, []);

  if (!deviceSupports) return false;
  return googleAvailable || !Array.isArray(signonOptions) || signonOptions.includes('apple');
};

export const AppleSignInButton = ({ utm = 'mobile-app' }: AppleSignInButtonProps) => {
  const { loginWithApple } = useAuth();
  const available = useAppleSignInAvailable();
  const [busy, setBusy] = useState(false);

  if (!available) return null;

  const onPress = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await loginWithApple({ utm });
      router.replace('/(app)/chat');
    } catch (error: any) {
      if (error?.name === 'AppleSignInCancelled') return;
      console.log('Apple sign-in error:', error);
      const message =
        error?.name === 'SocialRegistrationClosed'
          ? 'There is no account for this Apple ID email and registration is closed for this workspace.'
          : error?.response?.data?.error ||
            error?.response?.data?.message ||
            'Could not sign in with Apple. Please try again.';
      Alert.alert('Sign in with Apple', message);
    } finally {
      setBusy(false);
    }
  };

  // A custom button in the shape of the Google one (iOS 26 draws Apple's native button as a
  // capsule and ignores its corner radius). Apple's rules for custom buttons: the Apple
  // logo (the SF Symbol), the title "Sign in with Apple", black or white.
  return (
    <TouchableOpacity
      style={{
        position: 'relative',
        borderRadius: 15,
        backgroundColor: '#000',
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        opacity: busy ? 0.7 : 1,
      }}
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel="Sign in with Apple"
    >
      {busy ? (
        <ActivityIndicator color="#fff" style={{ position: 'absolute', left: 20 }} />
      ) : (
        <SymbolView
          name="apple.logo"
          tintColor="#fff"
          size={20}
          style={{ position: 'absolute', left: 20, width: 20, height: 20 }}
        />
      )}
      <Text style={{ color: '#fff', fontSize: 15 }}>Sign in with Apple</Text>
    </TouchableOpacity>
  );
};
