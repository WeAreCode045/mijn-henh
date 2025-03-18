
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Type guard for images or floorplans that can be passed as strings
 */
export function isStringUrl(item: string | PropertyImage | PropertyFloorplan): item is string {
  return typeof item === 'string';
}

/**
 * Safely access a property on an object that might be a string
 */
export function safePropertyAccess<T>(
  item: string | T, 
  property: keyof T, 
  defaultValue: any = null
): any {
  if (typeof item === 'string') return defaultValue;
  return (item as T)[property] !== undefined ? (item as T)[property] : defaultValue;
}

/**
 * Safely access the url property on a string or object
 */
export function safeUrlAccess(item: string | PropertyImage | PropertyFloorplan): string {
  if (typeof item === 'string') return item;
  return item.url || '';
}
