
import { PropertyImage, PropertyFloorplan } from "@/types/property";
import { normalizeImage } from "@/utils/imageHelpers";

/**
 * Hook providing utility functions for working with images in different formats
 */
export function useImageHelper() {
  /**
   * Gets a URL from any image format (string or object)
   */
  const getImageUrl = (image: string | PropertyImage | PropertyFloorplan | null): string | null => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    return image.url || null;
  };
  
  /**
   * Normalizes an array of mixed string/object images to PropertyImage[]
   */
  const normalizeImages = (images: (string | PropertyImage | PropertyFloorplan)[]): PropertyImage[] => {
    return images.map(img => {
      if (typeof img === 'string') {
        return {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          url: img,
          type: "image" as "image" | "floorplan"
        };
      }
      
      // Ensure all required fields exist
      return {
        id: img.id,
        url: img.url,
        type: (img as any).type === "floorplan" ? "floorplan" : "image",
        sort_order: (img as any).sort_order,
        is_main: (img as any).is_main,
        is_featured_image: (img as any).is_featured_image,
        area: (img as any).area,
        property_id: (img as any).property_id,
        filePath: (img as any).filePath,
        title: (img as any).title,
        description: (img as any).description
      };
    });
  };
  
  /**
   * Gets image IDs from a mixed array of images
   */
  const getImageIds = (images: (string | PropertyImage | PropertyFloorplan)[]): string[] => {
    return images.map(img => {
      if (typeof img === 'string') return `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      return img.id;
    });
  };
  
  /**
   * Finds an image in an array by ID
   */
  const findImageById = (
    images: (string | PropertyImage | PropertyFloorplan)[], 
    id: string
  ): PropertyImage | null => {
    if (!Array.isArray(images)) return null;
    
    const found = images.find(img => {
      if (typeof img === 'string') return false;
      return img.id === id;
    });
    
    if (!found) return null;
    if (typeof found === 'string') return normalizeImage(found);
    return normalizeImage(found);
  };
  
  return {
    getImageUrl,
    normalizeImages,
    getImageIds,
    findImageById
  };
}
