import { authSlice } from "@modules/auth/store";
import { configSlice } from "@modules/config/store";
import { configureStore } from "@reduxjs/toolkit";
import { setAppContextProvider } from "@modules/auth/interceptors";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [configSlice.name]: configSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Auth endpoints are authorized with the current app's appToken (see interceptors)
setAppContextProvider(() => {
  const { config: app, domain } = store.getState().config;
  return { appToken: app?.appToken, appId: app?._id, apiDomain: domain ?? undefined };
});

export type AppDispatchType = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatchType>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const dataRefreshMap: Record<string, (id: string) => unknown> = {};
