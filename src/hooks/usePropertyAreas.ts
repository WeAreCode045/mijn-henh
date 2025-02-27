
import { useState } from 'react';
import type { PropertyArea, PropertyFormData } from '@/types/property';

export function usePropertyAreas(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  // Add a new area to the property
  const addArea = () => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      imageIds: [],
      columns: 2 // Default to 2 columns
    };
    
    setFormData({
      ...formData,
      areas: [...(formData.areas || []), newArea],
    });
  };

  // Remove an area from the property
  const removeArea = (id: string) => {
    setFormData({
      ...formData,
      areas: formData.areas.filter(area => area.id !== id),
    });
  };

  // Update a specific field of an area
  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[] | number) => {
    console.log(`Updating area ${id}, field ${String(field)}, value:`, value);
    
    setFormData({
      ...formData,
      areas: formData.areas.map(area => 
        area.id === id ? { ...area, [field]: value } : area
      ),
    });
  };

  // Handle image upload for a specific area
  const handleAreaImageUpload = async (areaId: string, files: FileList) => {
    // Implementation for handling area image upload
    console.log(`Image upload for area ${areaId}, files:`, files);
    // This would typically involve uploading the images to your storage system
    // and then updating the area's imageIds
  };

  // Remove an image from an area
  const removeAreaImage = (areaId: string, imageId: string) => {
    setFormData({
      ...formData,
      areas: formData.areas.map(area => {
        if (area.id === areaId) {
          return {
            ...area,
            imageIds: (area.imageIds || []).filter(id => id !== imageId),
          };
        }
        return area;
      }),
    });
  };

  // Select images from existing property images for an area
  const handleAreaImagesSelect = (areaId: string, imageIds: string[]) => {
    console.log(`Selecting images for area ${areaId}, imageIds:`, imageIds);
    
    setFormData({
      ...formData,
      areas: formData.areas.map(area => {
        if (area.id === areaId) {
          return {
            ...area,
            imageIds: imageIds,
          };
        }
        return area;
      }),
    });
  };

  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    removeAreaImage,
    handleAreaImagesSelect,
  };
}
