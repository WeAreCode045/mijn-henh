
import { PropertyImage } from "@/types/property";

/**
 * Convert a string URL or a raw object to a PropertyImage object
 */
export function toPropertyImage(
  image: string | Record<string, any>
): PropertyImage {
  if (typeof image === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: image,
      type: "image"
    };
  }
  
  if (image && typeof image === 'object') {
    return {
      id: image.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: image.url || '',
      area: image.area || null,
      property_id: image.property_id || undefined,
      is_main: image.is_main || false,
      is_featured_image: image.is_featured_image || false,
      sort_order: image.sort_order || 0,
      type: image.type || "image",
      title: image.title || '',
      description: image.description || '',
      filePath: image.filePath || undefined,
      alt: image.alt || ''
    };
  }
  
  // Default fallback
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: '',
    type: "image"
  };
}

/**
 * Gets the title or alt text from an image, with fallbacks
 */
export function getImageTitle(
  image: PropertyImage | Record<string, any> | null | undefined,
  defaultTitle: string = 'Image'
): string {
  if (!image) return defaultTitle;
  return image.title || image.alt || defaultTitle;
}

/**
 * Gets URL from any object that might be an image
 */
export function getImageUrl(
  input: string | PropertyImage | Record<string, any> | null | undefined
): string {
  if (!input) return '';
  if (typeof input === 'string') return input;
  return input.url || '';
}
