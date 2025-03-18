
import { useState, useCallback } from 'react';
import { PropertyFormData, PropertyArea } from '@/types/property';

export function useAreaManagement(
  formData: PropertyFormData,
  setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const addArea = useCallback(() => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      name: '',
      size: '',
      unit: '',
      description: '',
      title: '',
      images: [],
      imageIds: []
    };
    
    setFormState(prev => ({
      ...prev,
      areas: [...(prev.areas || []), newArea]
    }));
  }, [setFormState]);
  
  const removeArea = useCallback((id: string) => {
    setFormState(prev => ({
      ...prev,
      areas: prev.areas.filter(area => area.id !== id)
    }));
  }, [setFormState]);
  
  const updateArea = useCallback((id: string, field: keyof PropertyArea, value: any) => {
    setFormState(prev => ({
      ...prev,
      areas: prev.areas.map(area => 
        area.id === id 
          ? { ...area, [field]: value }
          : area
      )
    }));
  }, [setFormState]);
  
  return {
    addArea,
    removeArea,
    updateArea
  };
}
