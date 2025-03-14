
import { useState, useCallback } from "react";
import { PropertyFormData } from "@/types/property";

export function usePropertyFormState(formState: PropertyFormData, setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>) {
  // Type-safe field change handler
  const handleFieldChange = useCallback(<K extends keyof PropertyFormData>(
    field: K, 
    value: PropertyFormData[K]
  ) => {
    console.log(`Field changed: ${String(field)} = `, value);
    setFormState(prevState => ({
      ...prevState,
      [field]: value
    }));
  }, [setFormState]);
  
  return {
    formState,
    setFormState,
    handleFieldChange,
    onFieldChange: handleFieldChange // For backward compatibility
  };
}
