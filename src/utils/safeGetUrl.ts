
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Safely get a URL from a mixed type (string or object with url property)
 * This handles any type that might be string | PropertyImage | PropertyFloorplan
 */
export function safeGetUrl(item: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'object' && 'url' in item) return item.url || '';
  return '';
}

/**
 * Get URLs from a collection that could contain strings or objects with url property
 * This is useful for mapping over mixed arrays
 */
export function safeGetUrls(items: (string | PropertyImage | PropertyFloorplan)[]): string[] {
  if (!Array.isArray(items)) return [];
  return items.map(item => safeGetUrl(item));
}

/**
 * Determines if an item is a PropertyImage by checking for required properties
 */
export function isPropertyImage(item: any): item is PropertyImage {
  return typeof item === 'object' && 
         item !== null && 
         'id' in item && 
         'url' in item;
}

/**
 * Determines if an item is a PropertyFloorplan by checking for required properties
 */
export function isPropertyFloorplan(item: any): item is PropertyFloorplan {
  return typeof item === 'object' && 
         item !== null && 
         'id' in item && 
         'url' in item;
}
