import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginScreenBackgroundImage } from '@/src/core/docs/config';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  CreateAccountButton,
  GoogleSignInButton,
  RegularLoginLabel,
  RegularLoginModal,
} from '@/src/modules/auth/components';
import { ConfirmModal } from '@/src/core/components';
import { useAppBranding, useConfig } from '@/src/modules/config/hooks';

export default function Login() {
  const { resetConfig } = useConfig();
  const { isBaseApp, displayName, logoSource, theme } = useAppBranding();
  const router = useRouter();

  const [defaultLoginOpen, setDefaultLoginOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);

  const navigateToRegisterScreen = () => router.push('/register');

  // Back to workspace selection (after confirmation): clear config in the store and local storage.
  // (auth)/_layout redirects to /domain once config.status is reset.
  const navigateToDomainScreen = () => setLeaveConfirmOpen(true);
  const confirmLeaveToDomain = async () => {
    setLeaveConfirmOpen(false);
    await resetConfig();
  };

  return (
    <ImageBackground
      // Base app — Ethora branded background, custom domain — white background
      source={isBaseApp ? loginScreenBackgroundImage : undefined}
      style={{
        backgroundColor: isBaseApp ? 'rgba(0,0,255, 0.05)' : theme.background,
        width: '100%',
        height: '100%',
      }}
    >
      <View
        className="w-[74%] h-full self-center relative flex flex-col justify-between"
        style={{
          paddingTop: hp('5.5%'),
          paddingBottom: hp('5.5%'),
        }}
      >
        <View>
          <View
            className="flex-row items-center justify-between"
            style={{ marginTop: isBaseApp ? 0 : hp('3%') }}
          >
            {/* Base app — small logo on the left; custom — large centered logo below */}
            {isBaseApp ? (
              <Image
                alt="App logo"
                accessibilityLabel="App logo"
                source={logoSource}
                resizeMode="contain"
                style={{ width: 78, height: 75 }}
              />
            ) : (
              <View />
            )}
            <TouchableOpacity
              onPress={navigateToDomainScreen}
              accessibilityLabel="Change domain"
              hitSlop={12}
              className="flex-row items-center"
            >
              <Ionicons name="chevron-back" size={18} color={theme.text} />
              <Text className="font-regular text-[16px]" style={{ color: theme.text }}>
                domain
              </Text>
            </TouchableOpacity>
          </View>

          {!isBaseApp && (
            <Image
              alt="App logo"
              accessibilityLabel="App logo"
              source={logoSource}
              resizeMode="contain"
              className="self-center"
              style={{ width: wp('46%'), height: wp('46%'), marginTop: hp('1%') }}
            />
          )}
        </View>
        <View className="justify-end h-100% pb-10.5%">
          <View testID="login-screen">
            <Text className="font-regular text-[40px] pb-4" style={{ color: theme.text }}>
              Welcome to {displayName}!
            </Text>
            <Text className="font-regular text-[16px] mt-8px mb-8" style={{ color: theme.text }}>
              Manage your community!
            </Text>
          </View>

          <View>
            <GoogleSignInButton
              backgroundColor={theme.buttonBackground}
              textColor={theme.buttonText}
              iconColor={theme.buttonText}
            />
            <CreateAccountButton
              navigateToRegisterScreen={navigateToRegisterScreen}
              color={theme.outline}
            />

            <RegularLoginLabel
              setOpen={() => setDefaultLoginOpen(true)}
              textColor={theme.text}
              linkColor={isBaseApp ? theme.text : theme.primary}
            />

            {/* <View className="mt-11 items-center">
              <SocialButtons />
            </View> */}
          </View>
        </View>
      </View>

      <ConfirmModal
        isOpen={leaveConfirmOpen}
        title="Leave this workspace?"
        message="Are you sure you want to go back and choose another domain?"
        confirmText="Yes, go back"
        cancelText="Cancel"
        color={isBaseApp ? undefined : theme.primary}
        onConfirm={confirmLeaveToDomain}
        onClose={() => setLeaveConfirmOpen(false)}
      />

      <View style={{ position: 'absolute' }}>
        <RegularLoginModal
          isOpen={defaultLoginOpen}
          onClose={() => setDefaultLoginOpen(false)}
          navigation={router}
        />
      </View>
    </ImageBackground>
  );
}
