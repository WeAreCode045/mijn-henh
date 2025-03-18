
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Converts a floorplan to the required PropertyFloorplan format
 */
export function normalizeFloorplan(floorplan: any): PropertyFloorplan {
  if (typeof floorplan === 'string') {
    return {
      id: `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: floorplan,
      title: '',
      description: '',
      sort_order: 0,
      filePath: '',
      type: "floorplan",
      columns: 1
    };
  }
  
  return {
    id: floorplan.id || `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: floorplan.url || '',
    title: floorplan.title || '',
    description: floorplan.description || '',
    sort_order: floorplan.sort_order !== undefined ? floorplan.sort_order : 0,
    filePath: floorplan.filePath || '',
    columns: typeof floorplan.columns === 'number' ? floorplan.columns : 1,
    type: floorplan.type || "floorplan"
  };
}

/**
 * Processes a mixed array of floorplans to ensure they all have the required properties
 */
export function processFloorplans(
  floorplans: (string | PropertyImage | PropertyFloorplan)[]
): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) return [];
  
  return floorplans.map(floorplan => {
    // Handle string URLs
    if (typeof floorplan === 'string') {
      return normalizeFloorplan(floorplan);
    }
    
    // Convert any PropertyImage to PropertyFloorplan if needed
    if ('type' in floorplan && floorplan.type === 'image') {
      return {
        id: floorplan.id,
        url: floorplan.url,
        title: (floorplan as any).title || '',
        description: (floorplan as any).description || '',
        sort_order: (floorplan as any).sort_order !== undefined ? (floorplan as any).sort_order : 0,
        filePath: (floorplan as any).filePath || '',
        type: "floorplan",
        columns: 1
      };
    }
    
    // Already a floorplan or floorplan-like object
    return normalizeFloorplan(floorplan);
  });
}

/**
 * Sorts floorplans by sort_order
 */
export function sortFloorplansByOrder(floorplans: PropertyFloorplan[]): PropertyFloorplan[] {
  return [...floorplans].sort((a, b) => {
    const orderA = a.sort_order !== undefined ? a.sort_order : 0;
    const orderB = b.sort_order !== undefined ? b.sort_order : 0;
    return orderA - orderB;
  });
}
