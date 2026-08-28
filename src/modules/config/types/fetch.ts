export interface SiteLinks {
    createdAt: string;
    updatedAt?: string;
    id: string;
    url: string;
    mdByteSize: number;
    md: string;
  }

export interface ModelAIbot {
    userId: string;
    chatId: string;
    status: "on" | "off";
    greetingMessage: string;
    isRAG: boolean;
    trigger: string;
    prompt: string;
    siteLinks: Array<string>;
    siteUrlsV2: Array<SiteLinks>;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      isBot: boolean;
    }
    chat: {
      _id: string;
      name: string;
      title: string;
      description: string;
      type: string;
      picture: string;
    }
  }

export interface ModelAppDefaulRooom {
  jid: string;
  pinned: boolean;
  title: string;
  creator: string;
  chatId: string;
}

export interface ModelApp {
    appToken: string;
    bundleId: string;
    coinName: string;
    coinSymbol: string;
    createdAt: string;
    creatorId: string;
    defaultAccessAssetsOpen: boolean;
    defaultAccessProfileOpen: boolean;
    defaultRooms: Array<ModelAppDefaulRooom>;
    displayName: string;
    domainName: string;
    isAllowedNewAppCreate: boolean;
    isBaseApp: boolean;
    parentAppId: string;
    primaryColor: string;
    signonOptions: Array<string>;
    logoImage: string;
    sublogoImage: string;
    appTagline: string;
    /** XMPP host of the app cluster, e.g. xmpp.chat-qa.ethora.com */
    xmppHost?: string;
    firebaseWebConfigString?: string;
    firebaseConfigParsed?: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;
    };
    stats: {
      recentlyApiCalls: number;
      recentlyFiles: number;
      recentlyIssuance: number;
      recentlyRegistered: number;
      recentlySessions: number;
      recentlyTokens: number;
      recentlyTransactions: number;
      totalApiCalls: number;
      totalFiles: number;
      totalIssuance: number;
      totalRegistered: number;
      totalSessions: number;
      totalTransactions: number;
      totalChats: number;
      totalTokens: number;
      recentlyChats: number;
    };
    systemChatAccount: {
      jid: string;
    };
    updatedAt: string;
    usersCanFree: boolean;
    _id: string;
    afterLoginPage: string;
    availableMenuItems: {
      chats: boolean;
      profile: boolean;
      settings: boolean;
    };
    googleServicesJson: string;
    googleServiceInfoPlist: string;
    appSecret: string;
    allowUsersToCreateRooms: boolean;
    aiBot: ModelAIbot;
  }