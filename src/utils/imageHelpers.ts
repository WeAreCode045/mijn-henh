
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Convert a string URL to a PropertyImage object
 */
export function toPropertyImage(url: string): PropertyImage {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url,
    type: 'image'
  };
}

/**
 * Convert array of strings/objects to PropertyImage array
 */
export function toPropertyImageArray(images: (string | PropertyImage | any)[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  return images.map(img => normalizeImage(img));
}

/**
 * Normalize different image formats into a consistent PropertyImage
 */
export function normalizeImage(img: string | PropertyImage | Record<string, any>): PropertyImage {
  // If it's a simple string URL
  if (typeof img === 'string') {
    return toPropertyImage(img);
  }
  
  // If it's already a PropertyImage or a similar object
  return {
    id: img.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: img.url,
    type: img.type || 'image',
    area: img.area,
    property_id: img.property_id,
    is_main: img.is_main,
    is_featured_image: img.is_featured_image,
    sort_order: img.sort_order,
    title: img.title,
    description: img.description,
    alt: img.alt,
    filePath: img.filePath
  };
}

/**
 * Safely get image URL regardless of type
 */
export function getImageUrl(image: string | PropertyImage | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}

/**
 * Format image data for display
 */
export function formatImageForDisplay(img: PropertyImage | string): PropertyImage {
  if (typeof img === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      url: img,
      type: 'image'
    };
  }
  return img;
}

/**
 * Get image title or generate one
 */
export function getImageTitle(img: PropertyImage | PropertyFloorplan): string {
  return img.title || 'Image';
}
