
import type { PropertyFormData } from '@/types/property';
import { useAreaManagement } from './useAreaManagement';
import { useAreaImageUpload } from './useAreaImageUpload';
import { useAreaImageRemove } from './useAreaImageRemove';
import { useAreaImageSelect } from './useAreaImageSelect';

export function usePropertyAreas(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  // Use all the smaller, focused hooks
  const { addArea, removeArea, updateArea } = useAreaManagement(formData, setFormData);
  const { handleAreaImageUpload, isUploading } = useAreaImageUpload(formData, setFormData);
  const { handleAreaImageRemove } = useAreaImageRemove(formData, setFormData);
  const { handleAreaImagesSelect } = useAreaImageSelect(formData, setFormData);

  // Return all the functions and state from the smaller hooks
  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    isUploading
  };
}
