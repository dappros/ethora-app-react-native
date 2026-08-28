import { ImageSourcePropType } from "react-native";
import { RequestStatus } from "@/src/core/types";
import { ModelApp, Workspace } from "@modules/config/types";

export interface UseConfigReturn {
  status: RequestStatus;
  configApp: ModelApp;
  domainName: string | null;
  domain: string | null;
  geConfigApp: (workspace: Workspace) => Promise<ModelApp>;
  restoreDomain: () => Promise<Workspace | null>;
  resetConfig: () => Promise<void>;
}

export interface AppBrandingTheme {
  background: string;
  text: string;
  primary: string;
  buttonBackground: string;
  buttonText: string;
  outline: string;
}

export interface AppBranding {
  isBaseApp: boolean;
  displayName: string;
  logoSource: ImageSourcePropType;
  theme: AppBrandingTheme;
}
