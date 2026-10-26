import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { openScheduledCall } from '@ethora/chat-component-rn';
import { Loading } from '@/src/core/components';
import { useAppColors } from '@/src/core/theme';
import { useAuth } from '@modules/auth/hooks';
import { useConfig } from '@modules/config/hooks';
import { slugFromParam } from '@modules/calls/scheduledCalls';

/**
 * Where a scheduled-call link lands: https://app.chat.ethora.com/call/<slug>
 * (universal link) and ethoraappreactnative://call/<slug> both arrive here, and so
 * does the tap on the reminder push.
 *
 * The slug is handed to the chat SDK, which opens the call once the user is signed in
 * and the chat is up (resolve the slug, open the room, show the pre-join screen, no
 * media before the tap). When that is not yet the case the SDK holds the slug, so this
 * screen only has to send the user where the app normally sends them:
 *  - signed out: to the existing auth screens (domain until a workspace is chosen, then
 *    login). After login the auth layout redirects to the chat, where the held link opens;
 *  - signed in: to the chat screen.
 */
export default function CallLinkScreen() {
  const { slug: param } = useLocalSearchParams<{ slug?: string | string[] }>();
  const router = useRouter();
  const { token } = useAuth();
  const { status: configStatus } = useConfig();
  const colors = useAppColors();
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    const slug = slugFromParam(param);
    if (slug) openScheduledCall(slug);

    if (token) {
      // Pops back to a chat that is already open (a link tapped while the app runs)
      // instead of stacking a second one; replaces this screen on a cold start.
      router.dismissTo('/(app)/chat');
    } else {
      router.replace(configStatus === 'success' ? '/(auth)/login' : '/(auth)/domain');
    }
  }, [param, token, configStatus, router]);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}>
      <Loading size={50} />
    </View>
  );
}
