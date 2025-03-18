
import { PropertyImage, PropertyFloorplan, PropertyArea } from "@/types/property";

/**
 * Utility functions to handle mixed types (string and object types)
 */

/**
 * Gets a URL from a mixed string/object type
 */
export function getMixedTypeUrl(item: string | { url: string } | null | undefined): string {
  if (!item) return '';
  return typeof item === 'string' ? item : item.url;
}

/**
 * Converts a string to a PropertyImage
 */
export function stringToPropertyImage(url: string): PropertyImage {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url,
    type: 'image'
  };
}

/**
 * Converts a mixed type array to a PropertyImage array
 */
export function mixedArrayToPropertyImageArray(
  items: (string | PropertyImage | PropertyFloorplan)[]
): PropertyImage[] {
  if (!Array.isArray(items)) return [];
  
  return items.map(item => {
    if (typeof item === 'string') {
      return stringToPropertyImage(item);
    }
    
    // It's already an object with required fields
    return {
      id: item.id,
      url: item.url,
      type: (item as any).type || 'image',
      alt: (item as any).alt,
      title: (item as any).title,
      description: (item as any).description,
      is_main: (item as any).is_main,
      is_featured_image: (item as any).is_featured_image,
      sort_order: (item as any).sort_order,
      property_id: (item as any).property_id,
      area: (item as any).area,
      filePath: (item as any).filePath
    };
  });
}

/**
 * Safe property access for mixed types
 */
export function getProperty<T>(
  item: any,
  property: string,
  defaultValue: T
): T {
  if (!item) return defaultValue;
  if (typeof item !== 'object') return defaultValue;
  return item[property] !== undefined ? item[property] : defaultValue;
}

/**
 * Helper for fixing union type issues when PropertyImage type is expected
 */
export function ensurePropertyImageType(images: (string | PropertyImage)[]): PropertyImage[] {
  return images.map(img => typeof img === 'string' ? stringToPropertyImage(img) : img);
}
