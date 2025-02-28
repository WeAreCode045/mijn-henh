
import { useState, useCallback } from "react";
import { PropertyFormData } from "@/types/property";

export function usePropertyFormState(initialData: PropertyFormData) {
  const [formState, setFormState] = useState<PropertyFormData>(initialData);
  
  // Create a memoized wrapper function for setFormState
  const setFormData = useCallback((data: PropertyFormData) => {
    console.log("Setting form data:", data);
    setFormState(data);
  }, []);

  // Type-safe field change handler memoized to prevent unnecessary re-renders
  const handleFieldChange = useCallback(<K extends keyof PropertyFormData>(
    field: K, 
    value: PropertyFormData[K]
  ) => {
    console.log(`Field changed: ${String(field)} = `, value);
    setFormState(prevState => ({
      ...prevState,
      [field]: value
    }));
  }, []);
  
  return {
    formState,
    setFormState: setFormData,
    handleFieldChange
  };
}
