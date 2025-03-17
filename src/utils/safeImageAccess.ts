
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Get URL from any image type safely
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
}

/**
 * Get alt text from image safely
 */
export function getImageAlt(image: string | PropertyImage | PropertyFloorplan | null | undefined, defaultAlt: string = ''): string {
  if (!image) return defaultAlt;
  if (typeof image === 'string') return defaultAlt;
  return image.alt || image.title || defaultAlt;
}

/**
 * Check if image is main image
 */
export function isMainImage(image: string | PropertyImage | null | undefined): boolean {
  if (!image || typeof image === 'string') return false;
  return !!image.is_main;
}

/**
 * Check if image is featured
 */
export function isFeaturedImage(image: string | PropertyImage | null | undefined): boolean {
  if (!image || typeof image === 'string') return false;
  return !!image.is_featured_image;
}

/**
 * Convert string image to PropertyImage
 */
export function stringToPropertyImage(url: string, type: "image" | "floorplan" = "image"): PropertyImage {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: url,
    type: type
  };
}

/**
 * Normalize mixed array of image types to PropertyImage[]
 */
export function normalizeImageArray(images: (string | PropertyImage | PropertyFloorplan)[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return stringToPropertyImage(img);
    }
    return img as PropertyImage;
  });
}

/**
 * Get image ID safely
 */
export function getImageId(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return '';
  return image.id || '';
}
