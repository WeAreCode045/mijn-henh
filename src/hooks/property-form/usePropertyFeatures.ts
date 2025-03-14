
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFormData, PropertyFeature } from '@/types/property';

export function usePropertyFeatures(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  // Add a new feature to the property
  const addFeature = useCallback(() => {
    const newFeature: PropertyFeature = {
      id: uuidv4(),
      description: ''
    };
    
    const updatedFeatures = formData.features ? 
      [...formData.features, newFeature] : 
      [newFeature];
    
    onFieldChange('features', updatedFeatures);
  }, [formData.features, onFieldChange]);
  
  // Remove a feature from the property
  const removeFeature = useCallback((id: string) => {
    if (!formData.features) return;
    
    const updatedFeatures = formData.features.filter(feature => feature.id !== id);
    onFieldChange('features', updatedFeatures);
  }, [formData.features, onFieldChange]);
  
  // Update a feature's description
  const updateFeature = useCallback((id: string, description: string) => {
    if (!formData.features) return;
    
    const updatedFeatures = formData.features.map(feature => {
      if (feature.id === id) {
        return { ...feature, description };
      }
      return feature;
    });
    
    onFieldChange('features', updatedFeatures);
  }, [formData.features, onFieldChange]);
  
  return {
    addFeature,
    removeFeature,
    updateFeature
  };
}
