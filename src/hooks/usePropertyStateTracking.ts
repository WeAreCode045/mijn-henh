
import { PropertyFormData } from "@/types/property";
import { Dispatch, SetStateAction } from "react";

type PropertyFormStateSetter = (formData: PropertyFormData | ((prevState: PropertyFormData) => PropertyFormData)) => void;

export function usePropertyStateTracking(
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setFormState: PropertyFormStateSetter,
  setPendingChanges: (pending: boolean) => void
) {
  // Create a wrapper function that also sets pendingChanges flag
  const handleFieldChangeWithTracking = (field: keyof PropertyFormData, value: any) => {
    handleFieldChange(field, value);
    setPendingChanges(true);
  };

  // Create a proper SetStateAction compatible function for formState
  const setFormStateWithTracking: Dispatch<SetStateAction<PropertyFormData>> = (newStateOrUpdater) => {
    if (typeof newStateOrUpdater === 'function') {
      // If it's a function updater, we need to call it with the previous state
      setFormState((prevState) => {
        // Call the updater function to get the new state
        const updatedState = (newStateOrUpdater as ((prev: PropertyFormData) => PropertyFormData))(prevState);
        setPendingChanges(true);
        return updatedState;
      });
    } else {
      // If it's a direct value
      setFormState(newStateOrUpdater);
      setPendingChanges(true);
    }
  };

  return {
    handleFieldChangeWithTracking,
    setFormStateWithTracking
  };
}
