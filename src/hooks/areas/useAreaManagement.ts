
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { PropertyArea, PropertyFormData } from '@/types/property';

export function useAreaManagement(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Add a new area to the property
  const addArea = () => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      imageIds: [],
      columns: 2 // Default to 2 columns
    };
    
    console.log("Adding new area with default columns:", newArea);
    
    setFormData({
      ...formData,
      areas: [...(formData.areas || []), newArea],
    });
  };

  // Remove an area from the property
  const removeArea = (id: string) => {
    console.log(`Removing area ${id}`);
    
    setFormData({
      ...formData,
      areas: formData.areas.filter(area => area.id !== id),
    });
  };

  // Update a specific field of an area
  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[] | number) => {
    console.log(`Updating area ${id}, field ${String(field)}, value:`, value);
    
    const updatedAreas = formData.areas.map(area => 
      area.id === id ? { ...area, [field]: value } : area
    );
    
    setFormData({
      ...formData,
      areas: updatedAreas,
    });
    
    // Log the updated areas for debugging
    console.log("Areas after update:", updatedAreas);
  };

  return {
    addArea,
    removeArea,
    updateArea
  };
}
