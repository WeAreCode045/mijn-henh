
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFormData, PropertyFeature } from '@/types/property';

export function usePropertyFeatures(
  formState: PropertyFormData,
  setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const addFeature = useCallback(() => {
    const newFeature: PropertyFeature = {
      id: uuidv4(),
      description: ''
    };
    
    const updatedFeatures = formState.features ? 
      [...formState.features, newFeature] : 
      [newFeature];
    
    setFormState(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  }, [formState.features, setFormState]);
  
  const removeFeature = useCallback((id: string) => {
    if (!formState.features) return;
    
    const updatedFeatures = formState.features.filter(feature => feature.id !== id);
    
    setFormState(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  }, [formState.features, setFormState]);
  
  const updateFeature = useCallback((id: string, description: string) => {
    if (!formState.features) return;
    
    const updatedFeatures = formState.features.map(feature => {
      if (feature.id === id) {
        return { ...feature, description };
      }
      return feature;
    });
    
    setFormState(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  }, [formState.features, setFormState]);
  
  return {
    addFeature,
    removeFeature,
    updateFeature
  };
}
