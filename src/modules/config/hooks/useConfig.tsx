import { useAppDispatch, useAppSelector } from "@/src/store";
import { UseConfigReturn } from "@modules/config/types";
import { useCallback } from "react";
import { configAppRequest } from "@modules/config/store";

export const useConfig = (): UseConfigReturn => {
  const status = useAppSelector((store) => store.config.status);
  const configApp = useAppSelector((store) => store.config.config);
  const dispatch = useAppDispatch();

  const geConfigApp = useCallback(
    (value?: string) => {
      return dispatch(configAppRequest(value)).unwrap();
    },
    [dispatch]
  );

  return {
    status,
    configApp,
    geConfigApp,
  }
}