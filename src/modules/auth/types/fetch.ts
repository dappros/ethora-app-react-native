export interface UserType {
  appId: string;
  authMethod: string;
  defaultWallet: {
    walletAddress: string;
  };
  description: string;
  email: string;
  emails: string[];
  firstName: string;
  homeScreen: string;
  isAgreeWithTerms: boolean;
  isAssetsOpen: boolean;
  isBot: string;
  isProfileOpen: boolean;
  isSuperAdmin: {
    read: boolean;
    write: boolean;
  };
  lastName: string;
  profileImage: string;
  registrationChannelType: string;
  roles: string[];
  signupPlan: string;
  stripeCustomerId: string;
  tags: string[];
  tempPassword: string;
  updatedAt: string;
  uuid: string;
  xmppPassword: string;
  xmppUsername: string;
  __v: number;
  _id: string;
}

export interface AuthLoginFetchDataValue {
  email: string;
  password: string;
}

export interface AuthResponse {
  app: Record<string, string>;
  refreshToken: string;
  token: string;
  wsToken: string;
  success: boolean;
  user: UserType;
 }

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthRefreshResponse {
  refreshToken: string;
  token: string;
  wsToken: string;
  xmppPassword?: string;
  fileToken?: string;
}

export interface AuthRegistrationFetchDataValue {
  email: string;
  password: string;
  cfToken: string;
  firstName: string;
  lastName: string;
  signupPlan?: string;
  utm?: string;
}