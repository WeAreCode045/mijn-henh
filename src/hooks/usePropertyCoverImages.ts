
import type { PropertyFormData } from "@/types/property";

export function usePropertyCoverImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const addPropertyCoverImage = () => {
    setFormData({
      ...formData,
      coverImages: [...(formData.coverImages || []), ""]
    });
  };

  const removePropertyCoverImage = (id: string) => {
    setFormData({
      ...formData,
      coverImages: (formData.coverImages || []).filter(url => url !== id)
    });
  };

  const updatePropertyCoverImage = (id: string, url: string) => {
    setFormData({
      ...formData,
      coverImages: (formData.coverImages || []).map(existingUrl => 
        existingUrl === id ? url : existingUrl
      )
    });
  };

  return {
    addPropertyCoverImage,
    removePropertyCoverImage,
    updatePropertyCoverImage,
  };
}
