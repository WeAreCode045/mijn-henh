
import type { PropertyFormData } from "@/types/property";

export function usePropertyFeaturedImage(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const handleSetFeaturedImage = (url: string | null) => {
    console.log("Setting featured image:", url);
    setFormData({
      ...formData,
      featuredImage: url
    });
  };

  const handleToggleGridImage = (url: string) => {
    console.log("Toggling grid image:", url);
    // Ensure gridImages is always an array
    const currentGridImages = Array.isArray(formData.gridImages) ? formData.gridImages : [];
    
    // If the image is already in the grid, remove it, otherwise add it
    const newGridImages = currentGridImages.includes(url)
      ? currentGridImages.filter(img => img !== url)
      : [...currentGridImages, url];
    
    // Limit to max 4 grid images
    const limitedGridImages = newGridImages.slice(0, 4);
    
    setFormData({
      ...formData,
      gridImages: limitedGridImages
    });
  };

  return {
    handleSetFeaturedImage,
    handleToggleGridImage,
  };
}
