import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Router } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS,
} from 'react-native-reanimated';
import { useForm } from 'react-hook-form';
import { FormTextField } from '@/src/core/components';
import { GoogleSignInButton } from '../GoogleSignInButton';
import { useAuth } from '@modules/auth/hooks';

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

  const handleClose = () => closeAnim(() => { setVisible(false); onClose(); });

  const handleForgotPassword = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://app.ethora.com/resetPassword');
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  };

  const startY = useSharedValue(0);
  const pan = Gesture.Pan()
    .onStart(() => { startY.value = translateY.value; })
    .onUpdate((e) => {
      const next = Math.max(0, startY.value + e.translationY);
      translateY.value = next;
      const p = 1 - Math.min(1, next / (H * 0.65));
      progress.value = p;
    })
    .onEnd((e) => {
      const shouldClose = e.velocityY > 900 || translateY.value > H * 0.25;
      if (shouldClose) closeAnim(() => runOnJS(onClose)());
      else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
        progress.value = withTiming(1, { duration: 150 });
      }
    });

  const onSubmit = async ({ email, password }: Form) => {
    if (email && password) {
      login({ email, password })
        .then(() => {
          clearErrors();
          navigation.push("(app)");
        })
        .catch(() => {
          setError('email', { type: 'server', message: "Email or password doesn't match!" });
          setError('password', { type: 'server', message: ' ' });
        });
    }


    try {
      clearErrors();
      console.log('email', email);
      console.log('password', password);

      throw new Error('invalid_credentials');
    } catch (e) {
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
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.sheet, sheetStyle]}>
            <View style={styles.pullArea}>
              <TouchableOpacity onPress={handleClose} style={{ alignItems: 'center' }}>
                <Ionicons name="chevron-down" size={24} color="#E8EDF2" />
                <Text style={styles.backText}>Back to Sign in</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Hello again!</Text>

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
                left={<FontAwesome name="envelope-o" size={20} color="#0052CD" />}
                hint=" "
              />

              <FormTextField<Form>
                control={control}
                name="password"
                placeholder="Password"
                secureTextEntry={!showPassword}
                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } }}
                left={<FontAwesome5 name="star-of-life" size={20} color="#0052CD" />}
                right={<Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#6B7280" />}
                onRightPress={() => setShowPassword((v) => !v)}
              />

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={{ alignSelf: 'flex-end', marginTop: 6 }}
              >
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
                style={[
                  styles.primaryBtn,
                  { backgroundColor: isSubmitting || !isValid ? '#8F8F8F' : '#0052CD' },
                ]}
              >
                {isSubmitting && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />}
                <Text style={styles.primaryBtnText}>Log in</Text>
              </TouchableOpacity>

              <Text style={styles.or}>or</Text>
              <GoogleSignInButton
                backgroundColor="#0052CD"
                textColor="#fff"
                iconColor="#fff"
              />
            </View>
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    width: '100%', height: '65%', backgroundColor: '#fff',
    borderTopLeftRadius: 80, borderTopRightRadius: 80,
    paddingTop: 40, paddingHorizontal: 45,
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 }, elevation: 30,
  },
  pullArea: { position: 'absolute', top: -80, left: '48%', justifyContent: 'center', alignItems: 'center' },
  backText: { marginTop: 17, color: '#E8EDF2', fontFamily: 'VarelaRound-Regular' },
  title: { color: '#0052CD', fontFamily: 'Poppins-Regular', fontSize: 40, marginBottom: 24 },
  link: { color: '#0052CD', textDecorationLine: 'underline' },
  primaryBtn: {
    borderRadius: 15, width: '100%', height: 45,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 20,
  },
  primaryBtnText: { fontSize: 18, color: '#fff' },
  or: { fontSize: 13, color: '#0052CD', marginTop: 15, marginBottom: 15, textAlign: 'center' },
});
