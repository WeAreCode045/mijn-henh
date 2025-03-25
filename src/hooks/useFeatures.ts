
import { useState, useRef, useCallback } from "react";
import type { PropertyFeature, PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export function useFeatures(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const addFeature = useCallback(() => {
    const newFeature = { id: Date.now().toString(), description: "" };
    const updatedFeatures = [...formData.features, newFeature];
    
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
    
    // Save directly to database if we have a property ID
    if (formData.id) {
      supabase
        .from('properties')
        .update({ features: JSON.stringify(updatedFeatures) })
        .eq('id', formData.id)
        .then(({ error }) => {
          if (error) {
            console.error("Error saving feature addition:", error);
          } else {
            console.log("Feature added and saved to database");
          }
        });
    }
  }, [formData, setFormData]);

  const removeFeature = useCallback((id: string) => {
    const updatedFeatures = formData.features.filter((feature) => feature.id !== id);
    
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
    
    // Save directly to database if we have a property ID
    if (formData.id) {
      supabase
        .from('properties')
        .update({ features: JSON.stringify(updatedFeatures) })
        .eq('id', formData.id)
        .then(({ error }) => {
          if (error) {
            console.error("Error saving feature removal:", error);
          } else {
            console.log("Feature removed and saved to database");
          }
        });
    }
  }, [formData, setFormData]);

  const updateFeature = useCallback((id: string, description: string) => {
    const updatedFeatures = formData.features.map((feature) =>
      feature.id === id ? { ...feature, description } : feature
    );
    
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
    
    // Save directly to database if we have a property ID
    if (formData.id) {
      supabase
        .from('properties')
        .update({ features: JSON.stringify(updatedFeatures) })
        .eq('id', formData.id)
        .then(({ error }) => {
          if (error) {
            console.error("Error saving feature update:", error);
          } else {
            console.log("Feature updated and saved to database");
          }
        });
    }
  }, [formData, setFormData]);

  return {
    addFeature,
    removeFeature,
    updateFeature,
  };
}
