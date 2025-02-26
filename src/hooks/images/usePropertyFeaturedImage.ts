
import type { PropertyFormData } from "@/types/property";

export function usePropertyFeaturedImage(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const handleSetFeaturedImage = (url: string | null) => {
    setFormData({
      ...formData,
      featuredImage: url
    });
  };

  const handleToggleGridImage = (urls: string[]) => {
    setFormData({
      ...formData,
      gridImages: urls
    });
  };

  return {
    handleSetFeaturedImage,
    handleToggleGridImage,
  };
}
