
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Get a URL from a string or object
 */
export function getUrlFromMixedType(item: string | PropertyImage | PropertyFloorplan): string {
  return typeof item === 'string' ? item : item.url;
}

/**
 * Convert a string into a PropertyImage object
 */
export function stringToPropertyImage(url: string): PropertyImage {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url,
    type: "image"
  };
}

/**
 * Convert a mixed array of strings and images to PropertyImage array
 */
export function convertMixedArrayToPropertyImageArray(
  items: (string | PropertyImage | PropertyFloorplan)[]
): PropertyImage[] {
  return items.map(item => {
    if (typeof item === 'string') {
      return stringToPropertyImage(item);
    }
    return item as PropertyImage;
  });
}

/**
 * For components that need to handle access to the 'url' property safely
 */
export function renderImageUrl(item: string | PropertyImage | PropertyFloorplan): string {
  if (!item) return '';
  return typeof item === 'string' ? item : item.url;
}
