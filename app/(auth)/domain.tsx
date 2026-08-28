import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { loginScreenBackgroundImage, logoPath } from '@/src/core/docs/config';
import { Button, ConfirmModal, TextField } from '@/src/core/components';
import { useConfig } from '@/src/modules/config/hooks';
import { DEFAULT_API_DOMAIN, DEFAULT_DOMAIN_NAME } from '@/src/modules/config/constants';
import { parseWorkspaceUrl } from '@/src/modules/config/utils/workspace';
import { Workspace } from '@/src/modules/config/types';

export default function Domain() {
  const router = useRouter();
  const { geConfigApp, status } = useConfig();

  const [domainName, setDomainName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [baseAppConfirmOpen, setBaseAppConfirmOpen] = useState(false);

  const isSubmitting = status === 'loading';
  // Input: workspace address, e.g. example.chat.ethora.com
  // → domainName=example, domain=chat.ethora.com → https://api.chat.ethora.com/v1/apps/get-config?domainName=example
  const workspace = parseWorkspaceUrl(domainName);
  const hasInput = domainName.trim().length > 0;

  const loadConfig = async (target: Workspace) => {
    setError(null);
    try {
      await geConfigApp(target);
      router.replace('/(auth)/login');
    } catch (e) {
      setError('Could not load config for this workspace. Please check the address and try again.');
    }
  };

  const onContinue = () => {
    if (!workspace) {
      setError('Enter a valid workspace address, e.g. example.chat.ethora.com');
      return;
    }
    loadConfig(workspace);
  };
  const onBaseApp = () => setBaseAppConfirmOpen(true);
  const onBaseAppConfirm = async () => {
    await loadConfig({ domainName: DEFAULT_DOMAIN_NAME, domain: DEFAULT_API_DOMAIN });
    setBaseAppConfirmOpen(false);
  };

  return (
    <ImageBackground
      source={loginScreenBackgroundImage}
      style={{ backgroundColor: 'rgba(0,0,255, 0.05)', width: '100%', height: '100%' }}>
      {/* keyboard-controller's KeyboardAvoidingView animates in sync with the native keyboard */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            className="flex w-[74%] flex-1 flex-col justify-between self-center"
            style={{ paddingTop: hp('5.5%'), paddingBottom: hp('5.5%') }}>
            <Image
              alt="App logo"
              accessibilityLabel="App logo"
              source={logoPath}
              resizeMode="cover"
              className="block"
            />

            <View testID="domain-screen">
              <Text className="font-regular pb-4 text-[32px] text-white">Your workspace</Text>
              <Text className="font-regular mb-8 text-[16px] text-white">
                Enter your domain name to continue
              </Text>

              <TextField
                placeholder="example.chat.ethora.com"
                value={domainName}
                onChangeText={(v) => {
                  setDomainName(v);
                  if (error) setError(null);
                }}
                error={error ?? undefined}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                textContentType="URL"
                editable={!isSubmitting}
                returnKeyType="go"
                onSubmitEditing={hasInput ? onContinue : undefined}
              />

              <Button
                title="Continue"
                onPress={onContinue}
                isValid={hasInput}
                isSubmitting={isSubmitting}
              />

              {/* "or" divider + hint before joining the open workspace */}
              <View className="mt-6 flex-row items-center">
                <View className="flex-1 h-px bg-white/40" />
                <Text className="mx-3 text-[13px] text-white/80 uppercase tracking-widest">or</Text>
                <View className="flex-1 h-px bg-white/40" />
              </View>
              <Text className="mt-4 text-center text-[14px] leading-5 text-white/80">
                No workspace yet? Join the open Ethora space to chat with the team and other users.
              </Text>

              <TouchableOpacity
                onPress={onBaseApp}
                disabled={isSubmitting}
                accessibilityLabel="Join our Open Workspace"
                className="mt-3 items-center">
                <Text className="font-regular text-[16px] text-white underline">
                  Join our Open Workspace
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <ConfirmModal
        isOpen={baseAppConfirmOpen}
        title="Use base Ethora settings?"
        message="Are you sure you want to use the default Ethora configuration?"
        confirmText="Yes, continue"
        cancelText="Cancel"
        isSubmitting={isSubmitting}
        onConfirm={onBaseAppConfirm}
        onClose={() => setBaseAppConfirmOpen(false)}
      />
    </ImageBackground>
  );
}
