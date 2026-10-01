import React, { useMemo } from 'react';
import { Chat, resolveTheme } from '@ethora/chat-component-rn';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useChatConfig } from '@/src/modules/chat/hooks';

export default function ChatScreen() {
  const chatConfig = useChatConfig();
  // Host chrome (screen ground, status bar) is painted with the same palette the chat resolves
  // from config.dark / config.darkColors — the status bar is host-owned per the library docs
  const chatTheme = useMemo(() => resolveTheme(chatConfig), [chatConfig]);

  return (
    <View style={{ flex: 1, backgroundColor: chatTheme.listBackground }}>
      <StatusBar style={chatTheme.statusBarStyle === 'light-content' ? 'light' : 'dark'} />
      {/* <Chat> mounts its own redux Provider and XmppProvider (ReduxWrapper);
          the outer XmppProvider from 26.5.x is not needed here — in 26.7.x it crashes outside the library store.
          key: recreate the whole XMPP session when the user changes */}
      <Chat key={chatConfig.userLogin?.user?._id ?? 'anon'} config={chatConfig} />
    </View>
  );
}
