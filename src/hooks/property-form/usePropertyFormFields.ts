
import { useCallback } from "react";
import { PropertyFormData } from "@/types/property";

export function usePropertyFormFields(
  formState: PropertyFormData, 
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const addFeature = useCallback(() => {
    const features = formState.features ? [...formState.features] : [];
    const newFeature = {
      id: `feature-${Date.now()}`,
      description: ""
    };
    
    handleFieldChange("features", [...features, newFeature]);
  }, [formState.features, handleFieldChange]);
  
  const removeFeature = useCallback((index: number) => {
    if (!formState.features) return;
    
    const updatedFeatures = [...formState.features];
    updatedFeatures.splice(index, 1);
    
    handleFieldChange("features", updatedFeatures);
  }, [formState.features, handleFieldChange]);
  
  const updateFeature = useCallback((index: number, value: string) => {
    if (!formState.features) return;
    
    const updatedFeatures = [...formState.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      description: value
    };
    
    handleFieldChange("features", updatedFeatures);
  }, [formState.features, handleFieldChange]);
  
  return {
    addFeature,
    removeFeature,
    updateFeature
  };
}
