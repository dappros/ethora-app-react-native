import React, { useCallback, useMemo, useState } from 'react';
import { Chat, resolveTheme } from '@ethora/chat-component-rn';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useChatConfig } from '@/src/modules/chat/hooks';

export default function ChatScreen() {
  // The chat's appearance is the user's pick in its Settings (kept on the device), not
  // necessarily the system scheme: the status bar must follow what the chat actually shows,
  // or light text sits on the light chat and vanishes. The chat reports it here on restore
  // and on every change.
  const [chatIsDark, setChatIsDark] = useState<boolean | undefined>(undefined);
  const onThemeChange = useCallback((_pref: 'light' | 'dark' | 'system', isDark: boolean) => {
    setChatIsDark(isDark);
  }, []);

  const chatConfig = useChatConfig({ onThemeChange });
  // Host chrome (screen ground, status bar) is painted with the same palette the chat resolves
  // from config.dark / config.darkColors — the status bar is host-owned per the library docs
  const chatTheme = useMemo(() => resolveTheme(chatConfig), [chatConfig]);
  const isDark = chatIsDark ?? chatTheme.dark;

  return (
    <View style={{ flex: 1, backgroundColor: chatTheme.listBackground }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {/* <Chat> mounts its own redux Provider and XmppProvider (ReduxWrapper);
          the outer XmppProvider from 26.5.x is not needed here — in 26.7.x it crashes outside the library store.
          key: recreate the whole XMPP session when the user changes */}
      <Chat key={chatConfig.userLogin?.user?._id ?? 'anon'} config={chatConfig} />
    </View>
  );
}
