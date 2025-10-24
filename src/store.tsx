import { authSlice } from "@modules/auth/store";
import { configSlice } from "@modules/config/store";
import { configureStore } from "@reduxjs/toolkit";
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

export type AppDispatchType = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatchType>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const dataRefreshMap: Record<string, (id: string) => unknown> = {};
