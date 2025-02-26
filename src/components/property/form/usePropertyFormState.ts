
import { useState } from 'react';
import { PropertyFormData, PropertyArea, PropertyImage } from '@/types/property';
import { usePropertyImages } from '@/hooks/usePropertyImages';
import { usePropertyAreas } from '@/hooks/usePropertyAreas';
import { usePropertyFormSubmit } from '@/hooks/usePropertyFormSubmit';
import { usePropertyAutosave } from '@/hooks/usePropertyAutosave';
import { useFeatures } from '@/hooks/useFeatures';

export function usePropertyFormState(
  initialData: PropertyFormData,
  onSubmit: (data: PropertyFormData) => Promise<void>
) {
  const [formData, setFormData] = useState<PropertyFormData>(initialData);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { autosaveData } = usePropertyAutosave();
  
  const {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const {
    addArea,
    removeArea,
    updateArea,
  } = usePropertyAreas(formData, setFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleMapImageDelete = async () => {
    setFormData({
      ...formData,
      map_image: null,
    });
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    addFeature,
    removeFeature,
    updateFeature,
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage,
    addArea,
    removeArea,
    updateArea,
    handleMapImageDelete,
  };
}
