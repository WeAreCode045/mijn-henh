
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFormData, PropertyArea, PropertyImage } from '@/types/property';
import { useAreaImageUpload } from './useAreaImageUpload';
import { useAreaImageSelect } from './useAreaImageSelect';
import { useAreaImageRemove } from './useAreaImageRemove';
import { useAreaManagement } from './useAreaManagement';

export function usePropertyAreas(
  formData: PropertyFormData,
  setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Use specialized area management utilities
  const { addArea, removeArea, updateArea } = useAreaManagement(formData, setFormState);
  const { handleAreaImageRemove } = useAreaImageRemove(formData, setFormState);
  const { handleAreaImagesSelect } = useAreaImageSelect(formData, setFormState);
  
  // Create a handleAreaImageUpload function for each area
  const handleAreaImageUpload = (areaId: string, files: FileList) => {
    // Find the area's existing imageIds
    const area = formData.areas?.find(a => a.id === areaId);
    const imageIds = area?.imageIds || [];
    
    // Create and use a new instance of useAreaImageUpload for this specific area
    const { handleAreaImageUpload: uploadHandler } = useAreaImageUpload(
      formData.id || '',
      areaId,
      imageIds,
      setFormState
    );
    
    return uploadHandler(files);
  };

  return {
    // Area management
    addArea,
    removeArea,
    updateArea,
    
    // Image management
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    isUploading
  };
}
