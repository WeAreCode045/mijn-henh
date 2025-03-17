
import { PropertyImage, PropertyFloorplan } from '@/types/property';

/**
 * Safe function to get the URL from any image type
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
}

/**
 * Safe function to get the alt text from any image type
 */
export function getImageAlt(image: string | PropertyImage | PropertyFloorplan | null | undefined, defaultAlt: string = ''): string {
  if (!image || typeof image === 'string') return defaultAlt;
  return (image as any).alt || (image as any).title || defaultAlt;
}

/**
 * Convert a string to a PropertyImage object
 */
export function stringToImage(url: string): PropertyImage {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url,
    type: 'image'
  };
}

/**
 * Converts any input to a PropertyImage
 */
export function asPropertyImage(input: string | PropertyImage | PropertyFloorplan): PropertyImage {
  if (typeof input === 'string') {
    return stringToImage(input);
  }
  
  // Already a PropertyImage or close enough
  return {
    id: input.id,
    url: input.url,
    type: (input as any).type || 'image',
    title: (input as any).title,
    description: (input as any).description,
    alt: (input as any).alt,
    area: (input as any).area,
    is_main: (input as any).is_main,
    is_featured_image: (input as any).is_featured_image,
    sort_order: (input as any).sort_order,
    filePath: (input as any).filePath,
    property_id: (input as any).property_id
  };
}

/**
 * Converts any array of images to a consistent PropertyImage array
 */
export function normalizeImageArray(images: (string | PropertyImage | PropertyFloorplan)[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  return images.map(img => asPropertyImage(img));
}

/**
 * Checks if an image is of a certain type
 */
export function isImageType(image: PropertyImage | PropertyFloorplan, type: 'image' | 'floorplan'): boolean {
  return (image as any).type === type;
}

/**
 * Safely gets a property from an image that might be a string
 */
export function getImageProperty<T>(
  image: string | PropertyImage | PropertyFloorplan | null | undefined,
  prop: string,
  defaultValue: T
): T {
  if (!image || typeof image === 'string') return defaultValue;
  return (image as any)[prop] !== undefined ? (image as any)[prop] : defaultValue;
}
