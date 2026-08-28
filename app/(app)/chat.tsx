import React from 'react';
import { Chat } from '@ethora/chat-component-rn';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatConfig } from '@/src/modules/chat/hooks';

export default function ChatScreen() {
  const chatConfig = useChatConfig();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      {/* <Chat> mounts its own redux Provider and XmppProvider (ReduxWrapper);
          the outer XmppProvider from 26.5.x is not needed here — in 26.7.x it crashes outside the library store.
          key: recreate the whole XMPP session when the user changes */}
      <Chat key={chatConfig.userLogin?.user?._id ?? 'anon'} config={chatConfig} />
    </SafeAreaView>
  );
}
