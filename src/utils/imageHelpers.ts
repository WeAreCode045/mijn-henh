
import { PropertyImage } from "@/types/property";

/**
 * Normalize image data to ensure consistent image object structure
 * This handles different image formats from API, form inputs, and database
 */
export function normalizeImage(image: string | PropertyImage | { url: string }): PropertyImage {
  // If image is already a PropertyImage type object, return it directly
  if (typeof image === 'object' && 'id' in image && 'url' in image) {
    // Ensure type is valid or set default
    return {
      ...image,
      type: image.type || "image"
    } as PropertyImage;
  }
  
  // If image is a string (URL only), create a PropertyImage object
  if (typeof image === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: image,
      type: "image"
    };
  }
  
  // If image is a simple object with url property, create a PropertyImage object
  if (typeof image === 'object' && 'url' in image) {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: image.url,
      type: "image"
    };
  }
  
  // Fallback, should not normally happen
  console.error('Invalid image format:', image);
  return {
    id: `img-${Date.now()}`,
    url: '',
    type: "image"
  };
}

/**
 * Get image URL from various image formats
 */
export function getImageUrl(image: string | PropertyImage | { url: string }): string {
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object' && 'url' in image) {
    return image.url;
  }
  
  return '';
}

/**
 * Get image ID from various image formats
 */
export function getImageId(image: string | PropertyImage | { url: string }): string {
  if (typeof image === 'object' && 'id' in image) {
    return image.id;
  }
  
  // Generate a stable ID for string URLs
  if (typeof image === 'string') {
    return `img-${image.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || Date.now()}`;
  }
  
  if (typeof image === 'object' && 'url' in image) {
    return `img-${image.url.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || Date.now()}`;
  }
  
  return `img-${Date.now()}`;
}

/**
 * Converts any image format to PropertyImage[] format
 */
export function normalizeImages(images: any[] | null | undefined): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => normalizeImage(img));
}

/**
 * Check if an image is of a specific format
 */
export function isImageOfType(image: any, type: 'string' | 'object' | 'property-image'): boolean {
  if (type === 'string') return typeof image === 'string';
  if (type === 'object') return typeof image === 'object' && image !== null;
  if (type === 'property-image') return typeof image === 'object' && image !== null && 'id' in image && 'url' in image;
  return false;
}
