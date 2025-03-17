
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Utility functions to handle mixed type image arrays safely
 */

/**
 * Safely extracts a URL from a string, PropertyImage, or PropertyFloorplan
 */
export const getImageUrl = (image: string | PropertyImage | PropertyFloorplan): string => {
  if (typeof image === 'string') return image;
  return image.url;
};

/**
 * Normalizes a mixed image array to PropertyImage[] format
 */
export const normalizeToPropertyImages = (
  images: (string | PropertyImage | PropertyFloorplan)[]
): PropertyImage[] => {
  return images.map(image => {
    if (typeof image === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: image,
        type: "image"
      };
    }
    // Already a PropertyImage or PropertyFloorplan with required fields
    return {
      id: image.id,
      url: image.url,
      type: (image as any).type === "floorplan" ? "floorplan" : "image",
      sort_order: (image as any).sort_order,
      title: (image as any).title,
      description: (image as any).description,
      filePath: (image as any).filePath,
      is_main: (image as any).is_main,
      is_featured_image: (image as any).is_featured_image,
      area: (image as any).area,
      property_id: (image as any).property_id
    };
  });
};

/**
 * Safely handle mixed string and object type for images in components
 * Returns the URL from any image type
 */
export const getSafeImageUrl = (image: string | PropertyImage | PropertyFloorplan | null): string | null => {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url;
};
