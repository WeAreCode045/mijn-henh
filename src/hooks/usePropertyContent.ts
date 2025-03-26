
import { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyAutoSave } from "./usePropertyAutoSave";

export function usePropertyContent(
  propertyId: string | undefined,
  initialData: PropertyFormData
) {
  const [formData, setFormData] = useState<PropertyFormData>(initialData);
  const { saveData, isSaving } = usePropertyAutoSave(propertyId);
  
  // Update form data when initial data changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  
  const updateFormData = (newData: Partial<PropertyFormData>) => {
    setFormData((prev) => {
      const updatedData = { ...prev, ...newData };
      
      // Autosave the data if propertyId exists
      if (propertyId) {
        saveData(newData);
      }
      
      return updatedData;
    });
  };
  
  return {
    formData,
    updateFormData,
    isSaving
  };
}
