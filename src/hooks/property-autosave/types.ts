
import { PropertyFormData } from "@/types/property";

export interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  pendingChanges: boolean;
}

export interface AutoSaveFieldParams<K extends keyof PropertyFormData> {
  propertyId: string;
  field: K;
  value: PropertyFormData[K];
}

export interface AutoSaveDataParams {
  id: string;
  [key: string]: any;
}

export interface AutoSaveResult {
  success: boolean;
  updatedAt?: string;
}
