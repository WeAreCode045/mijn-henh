
import type { PropertyFormData, PropertyGridImage } from "@/types/property";

export function usePropertyGridImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const addPropertyGridImage = () => {
    setFormData({
      ...formData,
      gridImages: [...formData.gridImages, ""]
    });
  };

  const removePropertyGridImage = (id: string) => {
    setFormData({
      ...formData,
      gridImages: formData.gridImages.filter(url => url !== id)
    });
  };

  const updatePropertyGridImage = (id: string, url: string) => {
    setFormData({
      ...formData,
      gridImages: formData.gridImages.map(existingUrl => 
        existingUrl === id ? url : existingUrl
      )
    });
  };

  return {
    addPropertyGridImage,
    removePropertyGridImage,
    updatePropertyGridImage,
  };
}
