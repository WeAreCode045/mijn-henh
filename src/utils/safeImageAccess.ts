
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * A collection of utility functions to safely access image properties
 * regardless of whether they are strings or objects
 */

/**
 * Safely gets an image URL from either a string or an object
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string | null {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url || null;
}

/**
 * Safely gets an image ID from an image object or generates one for strings
 */
export function getImageId(image: string | PropertyImage | PropertyFloorplan | null | undefined): string | null {
  if (!image) return null;
  if (typeof image === 'string') return `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  return image.id || null;
}

/**
 * Safely checks if an image is a main image
 */
export function isMainImage(image: string | PropertyImage | null | undefined): boolean {
  if (!image || typeof image === 'string') return false;
  return (image as PropertyImage).is_main === true;
}

/**
 * Safely checks if an image is a featured image
 */
export function isFeaturedImage(image: string | PropertyImage | null | undefined): boolean {
  if (!image || typeof image === 'string') return false;
  return (image as PropertyImage).is_featured_image === true;
}

/**
 * Safely gets image sort order with a fallback
 */
export function getImageSortOrder(image: string | PropertyImage | PropertyFloorplan | null | undefined): number {
  if (!image || typeof image === 'string') return 0;
  return (image as any).sort_order || 0;
}

/**
 * Converts any image format to a PropertyImage object
 */
export function ensurePropertyImageFormat(image: string | PropertyImage | PropertyFloorplan): PropertyImage {
  if (typeof image === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: image,
      type: "image"
    };
  }
  
  // Ensure it has the required PropertyImage fields
  return {
    id: image.id,
    url: image.url,
    type: (image as any).type === "floorplan" ? "floorplan" : "image",
    sort_order: (image as any).sort_order,
    is_main: (image as any).is_main,
    is_featured_image: (image as any).is_featured_image,
    description: (image as any).description,
    title: (image as any).title,
    area: (image as any).area,
    property_id: (image as any).property_id,
    filePath: (image as any).filePath
  };
}

/**
 * Converts any image array to a PropertyImage array
 */
export function ensurePropertyImageArray(images: (string | PropertyImage | PropertyFloorplan)[] | null | undefined): PropertyImage[] {
  if (!images) return [];
  return images.map(img => ensurePropertyImageFormat(img));
}
