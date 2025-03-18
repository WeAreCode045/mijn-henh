
import { PropertyFloorplan } from "@/types/property";

/**
 * Creates a PropertyFloorplan object from a URL
 */
export function createFloorplanFromUrl(url: string, index: number = 0): PropertyFloorplan {
  return {
    id: `floorplan-${Date.now()}-${index}`,
    url,
    sort_order: index,
    type: "floorplan"
  };
}

/**
 * Normalizes floorplan data to ensure required properties
 */
export function normalizeFloorplan(floorplan: any): PropertyFloorplan {
  if (typeof floorplan === 'string') {
    return createFloorplanFromUrl(floorplan);
  }
  
  return {
    id: floorplan.id || `floorplan-${Date.now()}`,
    url: floorplan.url || '',
    title: floorplan.title,
    alt: floorplan.alt,
    description: floorplan.description,
    sort_order: floorplan.sort_order || 0,
    type: "floorplan"
  };
}

/**
 * Converts an array of mixed data to PropertyFloorplan[]
 */
export function ensureFloorplanArray(data: any[]): PropertyFloorplan[] {
  if (!Array.isArray(data)) return [];
  
  return data.map((item, index) => {
    if (typeof item === 'string') {
      return createFloorplanFromUrl(item, index);
    }
    return normalizeFloorplan(item);
  });
}
