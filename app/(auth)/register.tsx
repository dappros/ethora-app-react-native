import { router } from "expo-router";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { whiteScreenBackgroundImage } from '@/src/core/docs/config';
import { Button, FormTextField } from "@/src/core/components";
import { getTurnstileToken } from "@/src/core/captcha/getTurnstileToken";
import { GoogleSignInButton } from "@/src/modules/auth/components";
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/modules/auth/hooks";

type Form = { firstName: string; lastName: string; email: string; password: string };

export default function Register() {
  const { register, login, status } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

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
      const cfToken = await getTurnstileToken();

      console.log("register", { firstName, lastName, email, password, cfToken });

      const utm = "mobile-app";
      
      await register({ firstName, lastName, email, password, cfToken, utm });
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
  
  return (
    <ImageBackground
      source={whiteScreenBackgroundImage}
      style={{
        backgroundColor: 'rgba(0,0,255, 0.05)',
        width: '100%',
        height: '100%',
      }}
    >
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

              <Button
              title="Sign up"
              onPress={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
              isValid={isValid}
              />

              <Text style={styles.or}>or</Text>
              <GoogleSignInButton
                backgroundColor="#0052CD"
                textColor="#fff"
                iconColor="#fff"
              />
            </View>
    </View>
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
});