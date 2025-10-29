import { router } from "expo-router";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, ActivityIndicator, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { whiteScreenBackgroundImage } from '@/src/core/docs/config';
import { Button, FormTextField } from "@/src/core/components";
import { getTurnstileToken } from "@/src/core/captcha/getTurnstileToken";
import { GoogleSignInButton } from "@/src/modules/auth/components";
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/modules/auth/hooks";

type Form = { firstName: string; lastName: string; email: string; password: string };

export default function Register() {
  const { register, login, status } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isLoadingTurnstile, setIsLoadingTurnstile] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const commonDomains = [
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'yandex.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'icloud.com',
    'proton.me',
  ];

  const levenshtein = (a: string, b: string) => {
    if (a === b) return 0;
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix: number[][] = Array.from({ length: an + 1 }, () =>
      new Array(bn + 1).fill(0)
    );
    for (let i = 0; i <= an; i++) matrix[i][0] = i;
    for (let j = 0; j <= bn; j++) matrix[0][j] = j;
    for (let i = 1; i <= an; i++) {
      const ca = a.charCodeAt(i - 1);
      for (let j = 1; j <= bn; j++) {
        const cb = b.charCodeAt(j - 1);
        const cost = ca === cb ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[an][bn];
  };

  const suggestEmail = (email: string): string | null => {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return null;
    const local = email.slice(0, atIndex).trim();
    const domain = email
      .slice(atIndex + 1)
      .trim()
      .toLowerCase();
    if (!local || !domain) return null;
    if (commonDomains.includes(domain)) return null;
    let best: { d: number; domain: string } | null = null;
    for (const candidate of commonDomains) {
      const distance = levenshtein(domain, candidate);
      if (!best || distance < best.d) best = { d: distance, domain: candidate };
    }
    if (best && best.d > 0 && best.d <= 2) {
      return `${local}@${best.domain}`;
    }
    return null;
  };
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    setError,
    clearErrors,
    setValue,
  } = useForm<Form>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: turnstileToken ? 1 : 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [turnstileToken, scaleAnim, opacityAnim]);

  const handleTurnstileCheck = async () => {
    if (turnstileToken) {
      setTurnstileToken(null);
      return;
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoadingTurnstile(true);
    try {
      const token = await getTurnstileToken();
      setTurnstileToken(token);
      console.log('Turnstile token received:', token);
    } catch (error) {
      console.error('Turnstile error:', error);
    } finally {
      setIsLoadingTurnstile(false);
    }
  };

  const onSubmit = async ({ firstName, lastName, email, password }: Form) => {
    const suggested = suggestEmail(email);
    if (suggested && suggested !== email) {
      setEmailSuggestion(suggested);
      setError('email', {
        type: 'suggestion',
        message: `Did you mean ${suggested}?`,
      });
      return;
    }

    try {
      if (!turnstileToken) {
        setError('email', {
          type: 'manual',
          message: 'Please complete the bot verification',
        });
        return;
      }

      console.log("register", { firstName, lastName, email, password, cfToken: turnstileToken });

      const utm = "mobile-app";
      
      await register({ firstName, lastName, email, password, cfToken: turnstileToken, utm });
      await login({ email, password });
      router.push("(app)");
    } catch (error: any) {
      setError('email', { 
        type: 'server', 
        message: error?.response?.data?.error || 'An account with this email already exists.' 
      });
      setError('password', { type: 'server', message: ' ' });
    }
  };
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ImageBackground
      source={whiteScreenBackgroundImage}
      style={{
        backgroundColor: 'rgba(0,0,255, 0.05)',
        width: '100%',
        height: '100%',
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{ flex: 1 }}>
              <View className="flex-1 justify-center px-11 relative">
                <TouchableOpacity className="absolute top-[45px] left-4" onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                <View>
              <Text style={styles.title}>Hi, there!</Text>

                <FormTextField<Form>
                  control={control}
                  name="firstName"
                  placeholder="First Name"
                  rules={{ required: 'First Name is required' }}
                  left={<FontAwesome5 name="user" size={20} color="#0052CD" />}
                  hint=" "
                />
                <FormTextField<Form>
                  control={control}
                  name="lastName"
                  placeholder="Last Name"
                  left={<FontAwesome5 name="user" size={20} color="#0052CD" />}
                  hint=" "
                />

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

              {emailSuggestion && (
                <Text 
                  style={{ color: '#8C8C8C', marginTop: 8 }}
                  onPress={() => {
                    setValue('email', emailSuggestion, { shouldValidate: true });
                    setEmailSuggestion(null);
                    clearErrors('email');
                  }}
                >
                  Did you mean {emailSuggestion}?
                </Text>
              )}

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

              <Animated.View
                style={[
                  styles.turnstileContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.turnstileCheckbox,
                    turnstileToken && styles.turnstileCheckboxSuccess,
                    isLoadingTurnstile && styles.turnstileCheckboxLoading,
                  ]}
                  onPress={handleTurnstileCheck}
                  disabled={isLoadingTurnstile}
                  activeOpacity={0.8}
                >
                  <View style={styles.turnstileContent}>
                    <View style={styles.turnstileIconContainer}>
                      {isLoadingTurnstile ? (
                        <ActivityIndicator size="small" color="#0052CD" />
                      ) : turnstileToken ? (
                        <View style={styles.successIconContainer}>
                          <Ionicons name="checkmark-circle" size={32} color="#0052CD" />
                        </View>
                      ) : (
                        <View style={styles.shieldIconContainer}>
                          <Ionicons name="shield-outline" size={28} color="#8F8F8F" />
                        </View>
                      )}
                    </View>

                    <View style={styles.turnstileTextContainer}>
                      <Text
                        style={[
                          styles.turnstileLabel,
                          turnstileToken && styles.turnstileLabelSuccess,
                        ]}
                      >
                        {turnstileToken
                          ? 'Verification complete'
                          : isLoadingTurnstile
                          ? 'Verifying...'
                          : 'Verify you are human'}
                      </Text>
                      {turnstileToken && (
                        <Text style={styles.turnstileSubtext}>
                          Protected by Cloudflare
                        </Text>
                      )}
                    </View>

                    {/* {turnstileToken && (
                      <View style={styles.turnstileBadge}>
                        <Ionicons name="shield" size={16} color="#fff" />
                      </View>
                    )} */}
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Button
              title="Sign up"
              onPress={handleSubmit(onSubmit)}
              isSubmitting={status === 'loading'}
              isValid={isValid && !!turnstileToken}
              />

              <Text style={styles.or}>or</Text>
              <GoogleSignInButton
                backgroundColor="#0052CD"
                textColor="#fff"
                iconColor="#fff"
              />
              </View>
            </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

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
  turnstileContainer: {
    marginTop: 20,
    marginBottom: 12,
  },
  turnstileCheckbox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8EDF2',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  turnstileCheckboxSuccess: {
    backgroundColor: '#F0F7FF',
    borderColor: '#0052CD',
    borderWidth: 2,
  },
  turnstileCheckboxLoading: {
    borderColor: '#0052CD',
    borderWidth: 2,
  },
  turnstileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  turnstileIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shieldIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EDF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnstileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  turnstileLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  turnstileLabelSuccess: {
    color: '#0052CD',
    fontWeight: '600',
  },
  turnstileSubtext: {
    fontSize: 12,
    color: '#8F8F8F',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  turnstileBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0052CD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});