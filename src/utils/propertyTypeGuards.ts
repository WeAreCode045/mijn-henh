
import { PropertyImage, PropertyArea, PropertyFloorplan } from "@/types/property";

/**
 * Type guards and converters for property-related types
 */

/**
 * Type guard to check if a value is a PropertyImage
 */
export function isPropertyImage(value: any): value is PropertyImage {
  return (
    typeof value === 'object' && 
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.url === 'string'
  );
}

/**
 * Type guard to check if a value is a PropertyFloorplan
 */
export function isPropertyFloorplan(value: any): value is PropertyFloorplan {
  return (
    typeof value === 'object' && 
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.url === 'string' &&
    (value.type === 'floorplan' || (!value.type && value.description))
  );
}

/**
 * Convert mixed string/object arrays to PropertyImage arrays
 */
export function toPropertyImageArray(images: (string | PropertyImage | PropertyFloorplan)[]): PropertyImage[] {
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img,
        type: 'image'
      };
    }
    // Copy all properties but ensure the required ones exist
    return {
      id: img.id,
      url: img.url,
      type: (img as any).type === 'floorplan' ? 'floorplan' : 'image',
      area: (img as any).area,
      property_id: (img as any).property_id,
      is_main: (img as any).is_main,
      is_featured_image: (img as any).is_featured_image,
      sort_order: (img as any).sort_order,
      filePath: (img as any).filePath,
      title: (img as any).title,
      description: (img as any).description
    };
  });
}

/**
 * Extract URLs from a mixed image array
 */
export function extractImageUrls(images: (string | PropertyImage | PropertyFloorplan)[]): string[] {
  return images.map(img => typeof img === 'string' ? img : img.url);
}

/**
 * Helper to safely access image properties
 */
export function getImageProperty<T extends keyof PropertyImage>(
  image: string | PropertyImage | PropertyFloorplan | null,
  property: T,
  defaultValue: PropertyImage[T]
): PropertyImage[T] {
  if (!image) return defaultValue;
  if (typeof image === 'string') return defaultValue;
  return (image as any)[property] !== undefined ? (image as any)[property] : defaultValue;
}
