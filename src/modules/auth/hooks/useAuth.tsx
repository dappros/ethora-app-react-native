import { useAppDispatch, useAppSelector } from "@/src/store";
import { useCallback } from "react";
import { logoutService } from "@ethora/chat-component-rn";
// Service import (not the @modules/push barrel): the barrel re-exports usePushNotifications, which imports useAuth → cycle
import { dropPushRegistration } from "@modules/push/service/pushService";
import { clearAppNotifications } from "@modules/push/service/appIconBadge";
import { signOutGoogle } from "@modules/auth/lib/googleSignIn";
import { UseAuthReturn, AuthLoginFetchDataValue, AuthRegistrationFetchDataValue } from "@modules/auth/types";
import {
  authCheckRequest,
  authGoogleLoginRequest,
  authLoginRequest,
  authRegistrationRequest,
  authSlice,
  autRefreshRequest,
} from "@modules/auth/store";

export const useAuth = (): UseAuthReturn => {
  const status = useAppSelector((store) => store.auth.status);
  const user = useAppSelector((store) => store.auth.user);
  const token = useAppSelector((store) => store.auth.token);
  const refreshToken = useAppSelector((store) => store.auth.refreshToken);
  const eventToken = useAppSelector((store) => store.auth.eventToken);
  const checked = useAppSelector((store) => store.auth.checked);
  const rememberMe = useAppSelector((store) => store.auth.rememberMe);
  const dispatch = useAppDispatch();

  const login = useCallback(
    (value: AuthLoginFetchDataValue) => {
      return dispatch(authLoginRequest(value)).unwrap();
    },
    [dispatch]
  );

  const loginWithGoogle = useCallback(
    (value?: { utm?: string }) => {
      return dispatch(authGoogleLoginRequest(value)).unwrap();
    },
    [dispatch]
  );

  const register = useCallback(
    (value: AuthRegistrationFetchDataValue) => {
      return dispatch(authRegistrationRequest(value)).unwrap();
    },
    [dispatch]
  );

  const check = useCallback(() => {
    return dispatch(authCheckRequest()).unwrap();
  }, [dispatch]);

  // Everything of the session that lives outside the chat: the push
  // registrations (the DELETE needs the still-valid auth token, so before
  // authLogout clears it), Google, the badge and delivered pushes, the auth store.
  // None of these throw — they log errors themselves.
  const finishLogout = useCallback(async () => {
    await dropPushRegistration();
    await signOutGoogle();
    await clearAppNotifications();
    dispatch(authSlice.actions.authLogout());
  }, [dispatch]);

  // Full logout: chat teardown (XMPP, component store and AsyncStorage), then the rest.
  const logout = useCallback(async () => {
    await logoutService.performLogout();
    await finishLogout();
  }, [finishLogout]);

  const refresh = useCallback(() => {
    return dispatch(autRefreshRequest()).unwrap();
  }, [dispatch]);

  return {
    status,
    user,
    token,
    refreshToken,
    checked,
    rememberMe,
    login,
    loginWithGoogle,
    register,
    check,
    logout,
    finishLogout,
    refresh,
    eventToken,
  };
};
