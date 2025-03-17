
import { PropertyImage } from "@/types/property";

/**
 * Helper function to get the URL from a string or PropertyImage
 */
export const getImageUrl = (image: string | PropertyImage): string => {
  if (typeof image === 'string') {
    return image;
  }
  return image.url;
};

/**
 * Helper function to normalize image data to PropertyImage format
 */
export const normalizeImage = (img: any): PropertyImage => {
  if (typeof img === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: img,
      type: "image" as "image" | "floorplan"
    };
  } 
  
  if (img && typeof img === 'object') {
    return {
      id: img.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: img.url || '',
      area: img.area || null,
      property_id: img.property_id || undefined,
      is_main: img.is_main || false,
      is_featured_image: img.is_featured_image || false,
      sort_order: img.sort_order || 0,
      type: img.type || "image" as "image" | "floorplan",
      title: img.title || '',
      description: img.description || ''
    };
  }
  
  // Default fallback
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: '',
    type: "image"
  };
};

/**
 * Helper function to safely process an array of images
 */
export const normalizeImages = (images: any[]): PropertyImage[] => {
  if (!Array.isArray(images)) {
    return [];
  }
  
  return images.map(img => normalizeImage(img));
};
