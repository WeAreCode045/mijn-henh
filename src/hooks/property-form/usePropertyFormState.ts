
import { useState, useCallback } from "react";
import { PropertyData, PropertyFormData } from "@/types/property";

export function usePropertyFormState(
  initialData: PropertyData,
  setPendingChanges: (pending: boolean) => void
) {
  const [formState, setFormState] = useState<PropertyFormData>(initialData);
  
  const handleFieldChange = useCallback((field: keyof PropertyFormData, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    setPendingChanges(true);
  }, [setPendingChanges]);
  
  return {
    formState,
    handleFieldChange
  };
}
