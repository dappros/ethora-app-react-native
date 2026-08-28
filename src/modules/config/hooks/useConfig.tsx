import { useAppDispatch, useAppSelector } from "@/src/store";
import { UseConfigReturn, Workspace } from "@modules/config/types";
import { useCallback } from "react";
import { configAppRequest, configDomainRestore, configReset } from "@modules/config/store";

export const useConfig = (): UseConfigReturn => {
  const status = useAppSelector((store) => store.config.status);
  const configApp = useAppSelector((store) => store.config.config);
  const domainName = useAppSelector((store) => store.config.domainName);
  const domain = useAppSelector((store) => store.config.domain);
  const dispatch = useAppDispatch();

  const geConfigApp = useCallback(
    (workspace: Workspace) => {
      return dispatch(configAppRequest(workspace)).unwrap();
    },
    [dispatch]
  );

  const restoreDomain = useCallback(() => {
    return dispatch(configDomainRestore()).unwrap();
  }, [dispatch]);

  const resetConfig = useCallback(() => {
    return dispatch(configReset()).unwrap();
  }, [dispatch]);

  return {
    status,
    configApp,
    domainName,
    domain,
    geConfigApp,
    restoreDomain,
    resetConfig,
  }
}
