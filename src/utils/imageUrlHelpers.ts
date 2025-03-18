
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Safely get image URL from either string or object
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}

/**
 * Process mixed image arrays safely
 */
export function processImageArray(images: (string | PropertyImage | PropertyFloorplan)[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img,
        type: "image"
      };
    }
    
    return img as PropertyImage;
  });
}

/**
 * Safely get a property from a mixed image type
 */
export function getImageProperty<T>(image: string | PropertyImage | PropertyFloorplan | null, property: string, defaultValue: T): T {
  if (!image || typeof image === 'string') return defaultValue;
  return (image as any)[property] !== undefined ? (image as any)[property] : defaultValue;
}
