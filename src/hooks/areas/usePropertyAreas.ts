
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
  const { handleAreaImageUpload } = useAreaImageUpload(formData, setFormState, setIsUploading);

  const handleAddArea = useCallback(() => {
    console.log("usePropertyAreas - Adding new area");
    addArea();
  }, [addArea]);

  return {
    // Area management
    addArea: handleAddArea,
    removeArea,
    updateArea,
    
    // Image management
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    isUploading
  };
}
