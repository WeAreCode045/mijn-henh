
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Extract URLs from an array of PropertyImage objects or string URLs
 */
export function extractImageUrls(images: (PropertyImage | string)[]): string[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') return img;
    return img.url;
  });
}

/**
 * Convert PropertyImage objects to simple URL strings
 */
export function propertyImagesToUrlArray(images: PropertyImage[]): string[] {
  if (!Array.isArray(images)) return [];
  return images.map(img => img.url);
}

/**
 * Convert URL strings to PropertyImage objects
 */
export function urlArrayToPropertyImages(urls: string[]): PropertyImage[] {
  if (!Array.isArray(urls)) return [];
  
  return urls.map(url => ({
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url,
    type: 'image'
  }));
}

/**
 * Extract property from array of different image types
 */
export function getPropertyFromImageArray<T>(
  images: (PropertyImage | PropertyFloorplan | string)[], 
  property: keyof PropertyImage, 
  defaultValue: T
): T[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') return defaultValue;
    return (img as any)[property] || defaultValue;
  });
}
