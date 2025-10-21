import { View, Text, TextInput, Pressable, ImageBackground, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { loginThunk } from '@/src/modules/auth/store/auth.slice';
import { loginScreenBackgroundImage, logoPath } from '@/src/core/docs/config';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    CreateAccountButton,
    GoogleSignInButton,
    RegularLoginLabel,
} from '@/src/modules/auth/components';


export default function Login() {
  const router = useRouter();
  
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);

  const [defaultLoginOpen, setDefaultLoginOpen] = useState(false);


  const navigateToRegisterScreen = () => router.push('/register');

  return (
    <ImageBackground
      source={loginScreenBackgroundImage}
      style={{
        backgroundColor: 'rgba(0,0,255, 0.05)',
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
        <Image
          alt="App logo"
          accessibilityLabel="App logo"
          source={logoPath}
          resizeMode={'cover'}
          className="block"
        />
        <View
          className="justify-end h-100% pb-10.5%"
        >
          <View testID="login-screen">
            <Text
              className="text-white font-regular text-[40px] pb-4"
            >
              Welcome to Ethora!
            </Text>
            <Text
              className="text-white font-regular text-[16px] mt-8px mb-8"
            >
              Manage your community!
            </Text>
          </View>

          <View>
              <GoogleSignInButton />
            <CreateAccountButton
              navigateToRegisterScreen={navigateToRegisterScreen}
            />

              <RegularLoginLabel setOpen={() => router.push('/login')} />
            
            {/* <View className="mt-11 items-center">
              <SocialButtons />
            </View> */}
          </View>
        </View>
      </View>

      {/* <View style={{ position: 'absolute' }}>
        <RegularLoginModal
          isOpen={defaultLoginOpen}
          onClose={() => setDefaultLoginOpen(false)}
          navigation={router}
        />
      </View> */}
    </ImageBackground>
  );
}
