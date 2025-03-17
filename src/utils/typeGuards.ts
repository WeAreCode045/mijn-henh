
import { PropertyImage, PropertyFloorplan, PropertyArea } from "@/types/property";

/**
 * Type guard to check if value is a PropertyImage
 */
export function isPropertyImage(value: any): value is PropertyImage {
  return (
    value && 
    typeof value === 'object' && 
    'id' in value &&
    'url' in value
  );
}

/**
 * Type guard to check if value is a PropertyFloorplan
 */
export function isPropertyFloorplan(value: any): value is PropertyFloorplan {
  return (
    value && 
    typeof value === 'object' && 
    'id' in value &&
    'url' in value &&
    (('type' in value && value.type === 'floorplan') || 
    'floorplan' in value)
  );
}

/**
 * Type guard to check if value is a PropertyArea
 */
export function isPropertyArea(value: any): value is PropertyArea {
  return (
    value && 
    typeof value === 'object' && 
    'id' in value &&
    'name' in value &&
    'size' in value
  );
}

/**
 * Type guard to check if value is a URL string
 */
export function isUrlString(value: any): value is string {
  return typeof value === 'string' && (
    value.startsWith('http://') || 
    value.startsWith('https://') || 
    value.startsWith('/') ||
    value.startsWith('data:')
  );
}

/**
 * Helper to safely get the URL from any image type
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
}
