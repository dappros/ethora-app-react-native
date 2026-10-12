import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginScreenBackgroundImage } from '@/src/core/docs/config';
import {
  CreateAccountButton,
  GoogleSignInButton,
  RegularLoginLabel,
  RegularLoginModal,
} from '@/src/modules/auth/components';
import { ConfirmModal } from '@/src/core/components';
import { useAppBranding, useConfig } from '@/src/modules/config/hooks';
import { useResponsive } from '@/src/core/hooks';

export default function Login() {
  const insets = useSafeAreaInsets();
  const { width, height, hp, isTablet, authContentWidth } = useResponsive();
  const { resetConfig } = useConfig();
  const { isBaseApp, displayName, logoSource, theme } = useAppBranding();
  const router = useRouter();
  const showBrandBackground = isBaseApp;
  // Custom logo: 46% of the width on phones, but not taller than a third of the screen
  // (landscape tablet) and not bigger than 280 (iPad, unfolded foldable)
  const customLogoSize = Math.min(width * 0.46, height * 0.3, 280);
  // Base app logo sits in the top row on phones; on tablets it moves into the centered group
  const logoInHeader = isBaseApp && !isTablet;

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
      // Base app — Ethora branded background in both themes, custom domain — white / dark ground
      source={showBrandBackground ? loginScreenBackgroundImage : undefined}
      style={{
        backgroundColor: showBrandBackground ? 'rgba(0,0,255, 0.05)' : theme.background,
        width: '100%',
        height: '100%',
      }}
    >
      <View
        className="h-full self-center relative flex flex-col"
        style={{
          width: authContentWidth,
          paddingTop: insets.top + hp(3),
          paddingBottom: hp(5.5),
        }}
      >
        <View
          className="flex-row items-start justify-between"
          style={{ marginTop: isBaseApp ? 0 : hp(3), alignItems: 'flex-start' }}
        >
          {/* Base app on phones — small logo on the left; otherwise the logo is below */}
          {logoInHeader ? (
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

        {/* Phone — logo at the top, form at the bottom; tablet — both grouped in the middle */}
        <View
          className="flex-1"
          style={{ justifyContent: isTablet ? 'center' : 'space-between' }}
        >
          {!logoInHeader ? (
            <Image
              alt="App logo"
              accessibilityLabel="App logo"
              source={logoSource}
              resizeMode="contain"
              style={
                isBaseApp
                  ? { width: 78, height: 75, marginBottom: 56 }
                  : {
                      width: customLogoSize,
                      height: customLogoSize,
                      alignSelf: 'center',
                      marginTop: hp(1),
                      marginBottom: isTablet ? 48 : 0,
                    }
              }
            />
          ) : (
            <View />
          )}

          <View className="justify-end">
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
                linkColor={showBrandBackground ? theme.text : theme.primary}
              />

              {/* <View className="mt-11 items-center">
                <SocialButtons />
              </View> */}
            </View>
          </View>
        </View>
      </View>

      <ConfirmModal
        isOpen={leaveConfirmOpen}
        title="Leave this workspace?"
        message="Are you sure you want to go back and choose another domain?"
        confirmText="Yes, go back"
        cancelText="Cancel"
        color={showBrandBackground ? undefined : theme.primary}
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
