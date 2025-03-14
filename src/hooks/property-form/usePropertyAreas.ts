
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFormData, PropertyArea, PropertyImage } from '@/types/property';

export function usePropertyAreas(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Add a new area
  const addArea = useCallback(() => {
    const newArea: PropertyArea = {
      id: uuidv4(),
      title: '',
      description: '',
      name: '',
      size: '',
      imageIds: [],
      images: [],
      columns: 2
    };
    
    const updatedAreas = formData.areas ? 
      [...formData.areas, newArea] : 
      [newArea];
    
    onFieldChange('areas', updatedAreas);
  }, [formData.areas, onFieldChange]);
  
  // Remove an area
  const removeArea = useCallback((id: string) => {
    if (!formData.areas) return;
    
    const updatedAreas = formData.areas.filter(area => area.id !== id);
    onFieldChange('areas', updatedAreas);
  }, [formData.areas, onFieldChange]);
  
  // Update an area's properties
  const updateArea = useCallback((id: string, field: string, value: any) => {
    if (!formData.areas) return;
    
    const updatedAreas = formData.areas.map(area => {
      if (area.id === id) {
        return { ...area, [field]: value };
      }
      return area;
    });
    
    onFieldChange('areas', updatedAreas);
  }, [formData.areas, onFieldChange]);
  
  // Remove an image from an area
  const handleAreaImageRemove = useCallback((areaId: string, imageId: string) => {
    if (!formData.areas) return;
    
    const updatedAreas = formData.areas.map(area => {
      if (area.id === areaId) {
        const updatedImageIds = area.imageIds.filter(id => id !== imageId);
        const updatedImages = area.images.filter(image => {
          // Handle both PropertyImage objects and string IDs
          if (typeof image === 'string') {
            return image !== imageId;
          }
          return image.id !== imageId;
        });
        
        return { 
          ...area, 
          imageIds: updatedImageIds,
          images: updatedImages 
        };
      }
      return area;
    });
    
    onFieldChange('areas', updatedAreas);
  }, [formData.areas, onFieldChange]);
  
  // Select images for an area
  const handleAreaImagesSelect = useCallback((areaId: string, imageIds: string[]) => {
    if (!formData.areas) return;
    
    const updatedAreas = formData.areas.map(area => {
      if (area.id === areaId) {
        // Add the selected images to the area
        return { 
          ...area, 
          imageIds 
        };
      }
      return area;
    });
    
    onFieldChange('areas', updatedAreas);
  }, [formData.areas, onFieldChange]);
  
  // Upload images for an area
  const handleAreaImageUpload = useCallback(async (areaId: string, files: FileList) => {
    setIsUploading(true);
    
    try {
      // In a real implementation, you would upload the files to your server
      // For now, we'll just simulate the upload
      const uploadedImageUrls = Array.from(files).map((file, index) => ({
        id: `temp_${uuidv4()}`,
        url: URL.createObjectURL(file)
      }));
      
      // Add the uploaded images to the area
      if (!formData.areas) return;
      
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          const updatedImages = [...area.images, ...uploadedImageUrls];
          const updatedImageIds = [...area.imageIds, ...uploadedImageUrls.map(img => img.id)];
          
          return { 
            ...area, 
            images: updatedImages,
            imageIds: updatedImageIds
          };
        }
        return area;
      });
      
      onFieldChange('areas', updatedAreas);
    } finally {
      setIsUploading(false);
    }
  }, [formData.areas, onFieldChange]);
  
  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    isUploading
  };
}
