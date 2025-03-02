
import type { PropertyFormData } from "@/types/property";

// This hook has been deprecated as featured image and grid image functionality has been removed
export function usePropertyFeaturedImage(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  // Return empty functions as placeholders to maintain backward compatibility
  return {
    handleSetFeaturedImage: () => {
      console.warn("Featured image functionality has been removed");
    },
    handleToggleGridImage: () => {
      console.warn("Grid image functionality has been removed");
    },
    isInGridImages: () => false,
    isFeaturedImage: () => false
  };
}
