import { RequestStatus } from "@/src/core/types";
import { UserType } from "@modules/auth/types";

export interface AuthSLiceState {
  user: UserType;
  status: RequestStatus;
  checked: boolean;
  rememberMe: boolean;
  token: string;
  refreshToken: string;
  eventToken: string;
}