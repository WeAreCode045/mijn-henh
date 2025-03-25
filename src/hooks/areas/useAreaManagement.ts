
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { PropertyArea, PropertyFormData, AreaImage } from '@/types/property';
import { Dispatch, SetStateAction } from 'react';

export function useAreaManagement(
  formData: PropertyFormData,
  setFormData: Dispatch<SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Add a new area to the property
  const addArea = () => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      columns: 2, // Default to 2 columns
      name: '',
      size: '',
      // Initialize with empty areaImages array
      areaImages: [],
      // Keep legacy fields for backward compatibility
      images: [],
      imageIds: []
    };
    
    console.log("Adding new area with default columns:", newArea);
    
    setFormData(prevData => ({
      ...prevData,
      areas: [...(prevData.areas || []), newArea],
    }));
  };

  // Remove an area from the property
  const removeArea = (id: string) => {
    console.log(`Removing area ${id}`);
    
    setFormData(prevData => ({
      ...prevData,
      areas: prevData.areas.filter(area => area.id !== id),
    }));
  };

  // Update a specific field of an area
  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[] | number | any[]) => {
    console.log(`Updating area ${id}, field ${String(field)}, value:`, value);
    
    setFormData(prevData => {
      const updatedAreas = prevData.areas.map(area => 
        area.id === id ? { ...area, [field]: value } : area
      );
      
      return {
        ...prevData,
        areas: updatedAreas,
      };
    });
    
    // Log the updated areas for debugging
    console.log("Areas after update - request sent");
  };

  return {
    addArea,
    removeArea,
    updateArea
  };
}
