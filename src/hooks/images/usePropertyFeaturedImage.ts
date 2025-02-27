
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

  const handleToggleGridImage = (url: string) => {
    // Ensure gridImages is always an array
    const currentGridImages = Array.isArray(formData.gridImages) ? formData.gridImages : [];
    
    // If the image is already in the grid, remove it, otherwise add it
    const newGridImages = currentGridImages.includes(url)
      ? currentGridImages.filter(img => img !== url)
      : [...currentGridImages, url];
    
    setFormData({
      ...formData,
      gridImages: newGridImages
    });
  };

  return {
    handleSetFeaturedImage,
    handleToggleGridImage,
  };
}
