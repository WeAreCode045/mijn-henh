
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Gets a URL from any type that might be a URL string or an object with a URL property
 * This is safe to use with union types like string | PropertyImage
 */
export function getUrl(item: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.url;
}

/**
 * Gets an array of URLs from mixed types
 */
export function getUrls(items: (string | PropertyImage | PropertyFloorplan)[]): string[] {
  if (!Array.isArray(items)) return [];
  return items.map(item => getUrl(item));
}

/**
 * Helper to render URL from any source
 * Use this in JSX for img src attributes
 */
export function renderUrl(
  item: string | PropertyImage | PropertyFloorplan | null | undefined,
  fallback: string = ''
): string {
  const url = getUrl(item);
  return url || fallback;
}

/**
 * Creates URL objects from PropertyImage interface for special cases
 */
export function createUrlObject(item: PropertyImage | PropertyFloorplan): { url: string, id: string } {
  return {
    url: item.url,
    id: item.id
  };
}
