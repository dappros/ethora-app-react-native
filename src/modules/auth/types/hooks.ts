import { RequestStatus } from "@/src/core/types";
import { AuthLoginFetchDataValue, AuthRefreshResponse, AuthRegistrationFetchDataValue, AuthResponse, UserType } from "./fetch";

export interface UseAuthReturn {
    status: RequestStatus;
    user: UserType;
    token: string;
    refreshToken: string;
    checked: boolean;
    rememberMe: boolean;
    login: (value: AuthLoginFetchDataValue) => Promise<AuthResponse>;
    register: (value: AuthRegistrationFetchDataValue) => Promise<AuthResponse>;
    check: () => Promise<AuthResponse>;
    logout: () => void;
    refresh: () => Promise<AuthRefreshResponse>;
    eventToken: string;
  }
