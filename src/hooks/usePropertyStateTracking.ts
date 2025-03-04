
import { PropertyFormData } from "@/types/property";
import { Dispatch, SetStateAction } from "react";

export function usePropertyStateTracking(
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setFormState: (formData: PropertyFormData) => void,
  setPendingChanges: (pending: boolean) => void
) {
  // Create a wrapper function that also sets pendingChanges flag
  const handleFieldChangeWithTracking = (field: keyof PropertyFormData, value: any) => {
    handleFieldChange(field, value);
    setPendingChanges(true);
  };

  // Create a wrapper function for setFormState that also sets pendingChanges flag
  // This adapter function helps maintain the original signature while being compatible with SetStateAction
  const setFormStateWithTracking = (newState: PropertyFormData) => {
    setFormState(newState);
    setPendingChanges(true);
  };

  return {
    handleFieldChangeWithTracking,
    setFormStateWithTracking
  };
}
