
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Safely gets a URL from a mixed type (string or PropertyImage)
 * This is essential for handling components that accept both formats
 */
export function safelyGetImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return "";
  if (typeof image === 'string') return image;
  return image.url;
}

/**
 * Normalizes an image collection to ensure consistent handling
 * This handles arrays that could contain strings, PropertyImage objects, or both
 */
export function normalizeImageCollection(images: (string | PropertyImage)[]): PropertyImage[] {
  if (!images) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img,
        type: 'image'
      };
    }
    return img;
  });
}

/**
 * Transforms any image-like object into a PropertyImage
 * This is useful when working with data from different sources
 */
export function transformToPropertyImage(image: any): PropertyImage {
  if (typeof image === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: image,
      type: "image"
    };
  }
  
  // If it's already an object, ensure it has the required properties
  return {
    id: image.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: image.url || '',
    type: image.type || 'image',
    alt: image.alt,
    title: image.title,
    description: image.description,
    is_main: image.is_main,
    is_featured_image: image.is_featured_image,
    sort_order: image.sort_order,
    property_id: image.property_id,
    area: image.area,
    filePath: image.filePath
  };
}
