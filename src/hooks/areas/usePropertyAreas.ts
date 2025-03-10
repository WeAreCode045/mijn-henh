
import type { PropertyFormData } from '@/types/property';
import { Dispatch, SetStateAction } from 'react';
import { useAreaManagement } from './useAreaManagement';
import { useAreaImageRemove } from './useAreaImageRemove';
import { useAreaImageSelect } from './useAreaImageSelect';

export function usePropertyAreas(
  formData: PropertyFormData,
  setFormData: Dispatch<SetStateAction<PropertyFormData>>
) {
  // Use all the smaller, focused hooks
  const { addArea, removeArea, updateArea } = useAreaManagement(formData, setFormData);
  const { handleAreaImageRemove } = useAreaImageRemove(formData, setFormData);
  const { handleAreaImagesSelect } = useAreaImageSelect(formData, setFormData);

  // Add the missing handleAreaImageUpload function
  const handleAreaImageUpload = (areaId: string, files: FileList) => {
    console.log(`Uploading images for area ${areaId}`, files);
    // This function would typically handle file uploads
    // Since it seems this is handled elsewhere or not implemented,
    // we'll provide a placeholder implementation
    return Promise.resolve();
  };

  // Return all the functions and state from the smaller hooks
  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload
  };
}
