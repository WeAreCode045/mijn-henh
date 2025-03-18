
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Safely get alt text from an image
 */
export function getSafeAltText(image: PropertyImage | PropertyFloorplan | null): string {
  if (!image) return '';
  return (image as any).alt || (image as any).title || '';
}

/**
 * Safely get ID from an image, with fallback generation
 */
export function getSafeImageId(image: string | PropertyImage | PropertyFloorplan | null): string {
  if (!image) return `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  if (typeof image === 'string') return `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  return image.id;
}

/**
 * Safely get URL from an image
 */
export function getSafeImageUrl(image: string | PropertyImage | PropertyFloorplan | null): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}

/**
 * Check if an image is marked as main
 */
export function isMainImage(image: PropertyImage | null): boolean {
  if (!image) return false;
  return !!((image as any).is_main);
}

/**
 * Check if an image is marked as featured
 */
export function isFeaturedImage(image: PropertyImage | null): boolean {
  if (!image) return false;
  return !!((image as any).is_featured_image);
}

/**
 * Create a default image with required properties
 */
export function createDefaultImage(url?: string): PropertyImage {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: url || '',
    type: 'image'
  };
}

/**
 * Get a safe URL from a mixed image type
 * Useful for components that need to handle different image formats
 */
export function getSafeUrl(img: string | PropertyImage | PropertyFloorplan | null): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.url;
}
