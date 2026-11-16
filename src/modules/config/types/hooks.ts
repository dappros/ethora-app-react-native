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
  dark: boolean;
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
  /** null — custom app without logoImage, render the default YouLogo (AppLogo) */
  logoSource: ImageSourcePropType | null;
  theme: AppBrandingTheme;
}
