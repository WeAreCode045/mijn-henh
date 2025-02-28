
import { useState } from "react";
import { PropertyFormData } from "@/types/property";

export function usePropertyFormState(initialData: PropertyFormData) {
  const [formState, setFormState] = useState<PropertyFormData>(initialData);
  
  // Create a typed wrapper function for setFormState that matches the expected signature
  const setFormData = (data: PropertyFormData) => {
    console.log("Setting form data:", data);
    setFormState(data);
  };

  // Update this function to properly handle the field change by accepting all required parameters
  const handleFieldChangeWrapper = (field: keyof PropertyFormData, value: any) => {
    console.log(`Field changed: ${String(field)} = `, value);
    // Instead of calling handleFieldChange with formState and setFormState,
    // we'll update formState directly since handleFieldChange expects different parameters
    setFormState({
      ...formState,
      [field]: value
    });
  };
  
  return {
    formState,
    setFormState: setFormData,
    handleFieldChange: handleFieldChangeWrapper
  };
}
