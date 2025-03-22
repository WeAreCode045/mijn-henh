
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
  
  const removeFeature = useCallback((id: string) => {
    if (!formState.features) return;
    
    const updatedFeatures = [...formState.features];
    const index = updatedFeatures.findIndex(feature => feature.id === id);
    if (index !== -1) {
      updatedFeatures.splice(index, 1);
      handleFieldChange("features", updatedFeatures);
    }
  }, [formState.features, handleFieldChange]);
  
  const updateFeature = useCallback((id: string, description: string) => {
    if (!formState.features) return;
    
    const updatedFeatures = [...formState.features];
    const index = updatedFeatures.findIndex(feature => feature.id === id);
    if (index !== -1) {
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        description
      };
      
      handleFieldChange("features", updatedFeatures);
    }
  }, [formState.features, handleFieldChange]);
  
  return {
    addFeature,
    removeFeature,
    updateFeature
  };
}
