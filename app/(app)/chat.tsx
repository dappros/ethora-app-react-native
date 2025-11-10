import { Chat as ChatComponentTest } from '@ethora/chat-component';
import React from 'react';
import { View, Text } from 'react-native';
import { useConfig } from '@/src/modules/config/hooks';
import { useAuth } from '@/src/modules/auth/hooks';
import { AuthRefreshResponse } from '@/src/modules/auth/types';


export const VITE_APP_XMPP_SERVICE = process.env.EXPO_PUBLIC_APP_XMPP_SERVICE;
export const VITE_XMPP_SERVICE = process.env.EXPO_PUBLIC_XMPP_SERVICE;
export const VITE_XMPP_HOST = process.env.EXPO_PUBLIC_XMPP_HOST;
export const VITE_API = process.env.EXPO_PUBLIC_API;

interface ChatComponentProps {
  config: any;
  currentUser: any;
  refresh: () => Promise<AuthRefreshResponse>;
}

const MemoizedChat = React.memo(function ChatComponent({
  config,
  currentUser,
  refresh,
}: ChatComponentProps) {

  const handleChangeTokens = async () => {
    await refresh();
    // localStorage.setItem('refreshToken-538', refresh);
    // localStorage.setItem('token-538', token);
    // httpTokens.token = token;
    // httpTokens.refreshToken = refresh;
  };
  return (
    // @ts-ignore
    <ChatComponentTest
      config={{
        colors: {
          primary: config?.primaryColor || '#fff',
          secondary: config?.secondaryColor || '#141414',
        },
        baseUrl: VITE_API ?? 'https://api.ethoradev.com/v1',
        // @ts-ignorex
        customAppToken: config.appToken,
        newArch: true,
        qrUrl: 'https://app.ethora.com/app/chat/?qrChatId=',
        xmppSettings: {
          devServer: VITE_APP_XMPP_SERVICE || '',
          host: VITE_XMPP_HOST || '',
          conference: VITE_APP_XMPP_SERVICE || '',
          xmppPingOnSendEnabled: true,
        },
        // @ts-ignorex
        roomListStyles: {
          maxHeight: 'calc(100%)',
          height: 'calc(100%)',
          borderRadius: '16px 0px 0px 16px',
          border: 'none',
          padding: '16px',
          color: '#141414',
        },
        chatRoomStyles: {
          maxHeight: 'calc(100%)',
          height: 'calc(100%)',
          borderRadius: '0px 16px 16px 0px',
          color: '#141414',
        },
        userLogin: {
          enabled: true,
          user: currentUser,
        },
        disableRoomMenu: true,
        defaultRooms: config?.defaultRooms || [],
        refreshTokens: {
          // @ts-ignore
          refreshFunction: handleChangeTokens,
          enabled: true,
        },
        setRoomJidInPath: true,
        enableRoomsRetry: { enabled: false, helperText: '' },
      }}
    />
  );
});

export default function Chat() {
  const { configApp: config } = useConfig();
  const { user: currentUser, refresh } = useAuth();
 
  return (
    <View className="grid grid-rows-[auto,_1fr] gap-4 h-full abc">
      <View className="md:px-8 hidden md:flex flex-col justify-between items-stretch md:items-center md:flex-row">
        <Text className="font-varela mb-4 text-[24px] md:mb-0 md:text-[34px] leading-none">
          Chats
        </Text>
        <View />
      </View>
      <View className="rounded-2xl bg-white px-0 overflow-hidden">
        <MemoizedChat 
          config={config}
          currentUser={currentUser}
          refresh={refresh}
        />
      </View>
    </View>
  );
}