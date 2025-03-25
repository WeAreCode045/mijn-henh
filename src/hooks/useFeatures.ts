
import { useState, useRef, useCallback } from "react";
import type { PropertyFeature, PropertyFormData } from "@/types/property";

export function useFeatures(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const addFeature = useCallback(() => {
    setFormData({
      ...formData,
      features: [...formData.features, { id: Date.now().toString(), description: "" }],
    });
  }, [formData, setFormData]);

  const removeFeature = useCallback((id: string) => {
    // Cancel any pending debounce for this feature
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
      delete debounceTimers.current[id];
    }
    
    setFormData({
      ...formData,
      features: formData.features.filter((feature) => feature.id !== id),
    });
  }, [formData, setFormData]);

  const updateFeature = useCallback((id: string, description: string) => {
    setFormData({
      ...formData,
      features: formData.features.map((feature) =>
        feature.id === id ? { ...feature, description } : feature
      ),
    });
  }, [formData, setFormData]);

  return {
    addFeature,
    removeFeature,
    updateFeature,
  };
}
