import { useAppDispatch, useAppSelector } from "@/src/store";
import { useCallback } from "react";
import { logoutService } from "@ethora/chat-component-rn";
import { dropPushRegistration } from "@modules/push";
import { UseAuthReturn, AuthLoginFetchDataValue, AuthRegistrationFetchDataValue } from "@modules/auth/types";
import {
  authCheckRequest,
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

  const register = useCallback(
    (value: AuthRegistrationFetchDataValue) => {
      return dispatch(authRegistrationRequest(value)).unwrap();
    },
    [dispatch]
  );

  const check = useCallback(() => {
    return dispatch(authCheckRequest()).unwrap();
  }, [dispatch]);

  // Unregister the push token first (the DELETE needs the still-valid auth token),
  // then full chat teardown (XMPP, component store and AsyncStorage), then reset auth.
  // dropPushRegistration and performLogout never throw — they log errors themselves.
  const logout = useCallback(async () => {
    await dropPushRegistration();
    await logoutService.performLogout();
    dispatch(authSlice.actions.authLogout());
  }, [dispatch]);

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
    register,
    check,
    logout,
    refresh,
    eventToken,
  };
};
