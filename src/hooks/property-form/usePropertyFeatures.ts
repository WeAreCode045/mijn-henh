
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFormData, PropertyFeature } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';

export function usePropertyFeatures(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  // Save feature changes directly to the database
  const saveFeaturesField = useCallback(async (features: PropertyFeature[]) => {
    if (!formData.id) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ features: JSON.stringify(features) })
        .eq('id', formData.id);

      if (error) {
        console.error("Error saving features:", error);
      } else {
        console.log("Features saved to database successfully");
      }
    } catch (err) {
      console.error("Failed to save features:", err);
    }
  }, [formData.id]);
  
  // Add a new feature to the property
  const addFeature = useCallback(async () => {
    const newFeature: PropertyFeature = {
      id: uuidv4(),
      description: ''
    };
    
    const updatedFeatures = formData.features ? 
      [...formData.features, newFeature] : 
      [newFeature];
    
    // Update in-memory state
    onFieldChange('features', updatedFeatures);
    
    // Save directly to database
    await saveFeaturesField(updatedFeatures);
  }, [formData.features, onFieldChange, saveFeaturesField]);
  
  // Remove a feature from the property
  const removeFeature = useCallback(async (id: string) => {
    if (!formData.features) return;
    
    const updatedFeatures = formData.features.filter(feature => feature.id !== id);
    
    // Update in-memory state
    onFieldChange('features', updatedFeatures);
    
    // Save directly to database
    await saveFeaturesField(updatedFeatures);
  }, [formData.features, onFieldChange, saveFeaturesField]);
  
  // Update a feature's description
  const updateFeature = useCallback(async (id: string, description: string) => {
    if (!formData.features) return;
    
    const updatedFeatures = formData.features.map(feature => {
      if (feature.id === id) {
        return { ...feature, description };
      }
      return feature;
    });
    
    // Update in-memory state
    onFieldChange('features', updatedFeatures);
    
    // Save directly to database
    await saveFeaturesField(updatedFeatures);
  }, [formData.features, onFieldChange, saveFeaturesField]);
  
  return {
    addFeature,
    removeFeature,
    updateFeature
  };
}
