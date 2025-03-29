
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { PropertyArea, PropertyFormData } from '@/types/property';
import type { AreaImage } from '@/types/property';
import { Dispatch, SetStateAction } from 'react';

export function useAreaManagement(
  formData: PropertyFormData,
  setFormData: Dispatch<SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Add a new area to the property
  const addArea = () => {
    console.log("useAreaManagement - Adding new area");
    
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      title: 'New Area',
      description: '',
      columns: 2, // Default to 2 columns
      name: 'New Area',
      size: '',
      // Initialize with empty areaImages array
      areaImages: [],
      // Keep legacy fields for backward compatibility
      images: [],
      imageIds: []
    };
    
    console.log("Adding new area with default columns:", newArea);
    
    setFormData(prevData => {
      // Ensure areas is always an array
      const prevAreas = Array.isArray(prevData.areas) ? prevData.areas : [];
      return {
        ...prevData,
        areas: [...prevAreas, newArea],
      };
    });
    
    // Log after update
    console.log("Area added, new state requested");
  };

  // Remove an area from the property
  const removeArea = (id: string) => {
    console.log(`Removing area ${id}`);
    
    setFormData(prevData => {
      // Ensure areas is always an array
      const prevAreas = Array.isArray(prevData.areas) ? prevData.areas : [];
      return {
        ...prevData,
        areas: prevAreas.filter(area => area.id !== id),
      };
    });
  };

  // Update a specific field of an area
  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[] | number | AreaImage[]) => {
    console.log(`Updating area ${id}, field ${String(field)}, value:`, value);
    
    setFormData(prevData => {
      // Ensure areas is always an array
      const prevAreas = Array.isArray(prevData.areas) ? prevData.areas : [];
      const updatedAreas = prevAreas.map(area => 
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
