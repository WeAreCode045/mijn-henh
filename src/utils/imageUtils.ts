
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Safely extract URL from any image type
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
}

/**
 * Get image ID safely from any image type
 */
export function getImageId(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return '';
  return image.id || '';
}

/**
 * Convert string or object to PropertyImage
 */
export function toPropertyImage(img: string | PropertyImage | Record<string, any>): PropertyImage {
  if (typeof img === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: img,
      type: "image",
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
      type: img.type || "image",
      title: img.title || '',
      description: img.description || '',
      filePath: img.filePath || undefined,
      alt: img.alt || ''
    };
  }
  
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: '',
    type: "image"
  };
}

/**
 * Convert mixed array to PropertyImage array
 */
export function toPropertyImages(images: any[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  return images.map(img => toPropertyImage(img));
}

/**
 * Get an image's safe display title
 */
export function getImageTitle(image: string | PropertyImage | PropertyFloorplan): string {
  if (typeof image === 'string') return '';
  return image.title || '';
}
