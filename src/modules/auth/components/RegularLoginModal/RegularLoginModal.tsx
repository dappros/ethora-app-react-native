import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { type ImperativeRouter as Router } from 'expo-router';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useForm } from 'react-hook-form';
import { FormTextField } from '@/src/core/components';
import { GoogleSignInButton } from '../GoogleSignInButton';
import { useAuth } from '@modules/auth/hooks';
import { useAppBranding } from '@modules/config/hooks';

type Form = { email: string; password: string };

interface RegularLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Router;
}

const H = Dimensions.get('window').height;
const DURATION = 280;

export const RegularLoginModal: FC<RegularLoginModalProps> = ({ isOpen, onClose, navigation }) => {
  const { login, status } = useAuth();
  const { theme } = useAppBranding();
  const primary = theme.primary;
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    setError,
    clearErrors,
  } = useForm<Form>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const [visible, setVisible] = useState(isOpen);
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setKeyboardOpen(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const translateY = useSharedValue(H);
  const progress = useSharedValue(0);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value, { duration: DURATION }),
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const openAnim = () => {
    translateY.value = withTiming(0, { duration: DURATION });
    progress.value = 1;
  };
  const closeAnim = (cb?: () => void) => {
    translateY.value = withTiming(H, { duration: DURATION }, () => cb && runOnJS(cb)());
    progress.value = 0;
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(openAnim);
    } else if (visible) {
      closeAnim(() => setVisible(false));
    }
  }, [isOpen]);

  const finishClose = () => {
    setVisible(false);
    onClose();
  };
  const handleClose = () => closeAnim(finishClose);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleForgotPassword = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://app.ethora.com/resetPassword');
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  };

  const startY = useSharedValue(0);
  const pan = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const next = Math.max(0, startY.value + e.translationY);
      translateY.value = next;
      const p = 1 - Math.min(1, next / (H * 0.65));
      progress.value = p;
    })
    .onEnd((e) => {
      const shouldClose = e.velocityY > 900 || translateY.value > H * 0.25;
      if (shouldClose) {
        // We are on the UI thread (worklet): animate here, call the JS callback via runOnJS
        progress.value = 0;
        translateY.value = withTiming(H, { duration: DURATION }, (finished) => {
          if (finished) runOnJS(finishClose)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
        progress.value = withTiming(1, { duration: 150 });
      }
    });

  const onSubmit = async ({ email, password }: Form) => {
    if (!email || !password) return;

    clearErrors();
    try {
      await login({ email, password });
      navigation.replace('/(app)/chat');
    } catch {
      setError('email', { type: 'server', message: "Email or password doesn't match!" });
      setError('password', { type: 'server', message: ' ' });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
      presentationStyle="overFullScreen">
      {/* GestureHandlerRootView: gestures inside RN Modal live in a separate native window */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
        />
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'android' ? -insets.bottom : 0}
          style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable
            style={styles.dismissArea}
            onPress={keyboardOpen ? dismissKeyboard : handleClose}
            accessibilityLabel="Close"
          />
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[styles.sheet, keyboardOpen ? styles.sheetCompact : null, sheetStyle]}>
              <View style={styles.pullArea}>
                <TouchableOpacity onPress={handleClose} style={{ alignItems: 'center' }}>
                  <Ionicons name="chevron-down" size={24} color="#E8EDF2" />
                  <Text style={styles.backText}>Back to Sign in</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  styles.sheetContent,
                  keyboardOpen && {
                    paddingBottom: 20 + (Platform.OS === 'android' ? insets.bottom : 0),
                  },
                ]}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                  <View>
                    <Text style={[styles.title, { color: primary }]}>Hello again!</Text>

                    <FormTextField<Form>
                      control={control}
                      name="email"
                      placeholder="Email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      rules={{
                        required: 'Email is required',
                        pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                      }}
                      left={<FontAwesome name="envelope-o" size={20} color={primary} />}
                      accentColor={primary}
                      hint=" "
                    />

                    <FormTextField<Form>
                      control={control}
                      name="password"
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      rules={{
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Min 6 chars' },
                      }}
                      left={<FontAwesome5 name="star-of-life" size={20} color={primary} />}
                      right={
                        <Ionicons
                          name={showPassword ? 'eye' : 'eye-off'}
                          size={20}
                          color="#6B7280"
                        />
                      }
                      onRightPress={() => setShowPassword((v) => !v)}
                      accentColor={primary}
                    />

                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      style={{ alignSelf: 'flex-end', marginTop: 6 }}>
                      <Text style={[styles.link, { color: primary }]}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleSubmit(onSubmit)}
                      disabled={isSubmitting || !isValid}
                      style={[
                        styles.primaryBtn,
                        { backgroundColor: isSubmitting || !isValid ? '#8F8F8F' : primary },
                      ]}>
                      {isSubmitting && (
                        <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
                      )}
                      <Text style={styles.primaryBtnText}>Log in</Text>
                    </TouchableOpacity>

                    {!keyboardOpen && (
                      <>
                        <Text style={[styles.or, { color: primary }]}>or</Text>
                        <GoogleSignInButton
                          backgroundColor={primary}
                          textColor="#fff"
                          iconColor="#fff"
                        />
                      </>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  dismissArea: { flex: 1 },
  sheet: {
    width: '100%',
    height: H * 0.65,
    maxHeight: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    paddingTop: 40,
    paddingHorizontal: 45,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 30,
  },
  sheetCompact: { height: undefined },
  scroll: { flexGrow: 0, flexShrink: 1 },
  sheetContent: { paddingBottom: 24 },
  pullArea: {
    position: 'absolute',
    top: -84,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { marginTop: 17, color: '#E8EDF2', fontFamily: 'VarelaRound-Regular' },
  title: { color: '#0052CD', fontFamily: 'Poppins-Regular', fontSize: 40, marginBottom: 24 },
  link: { color: '#0052CD', textDecorationLine: 'underline' },
  primaryBtn: {
    borderRadius: 15,
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  primaryBtnText: { fontSize: 18, color: '#fff' },
  or: { fontSize: 13, color: '#0052CD', marginTop: 15, marginBottom: 15, textAlign: 'center' },
});
