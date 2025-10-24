import { RequestStatus } from "@/src/core/types";
import { ModelApp } from "@modules/config/types";

export interface UseConfigReturn {
  status: RequestStatus;
  configApp: ModelApp;
  geConfigApp: (value?: string) => Promise<ModelApp>;
}