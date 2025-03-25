
import { useState, useRef, useCallback } from "react";
import type { PropertyFeature, PropertyFormData } from "@/types/property";

export function useFeatures(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const addFeature = useCallback(() => {
    setFormData({
      ...formData,
      features: [...formData.features, { id: Date.now().toString(), description: "" }],
    });
  }, [formData, setFormData]);

  const removeFeature = useCallback((id: string) => {
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
