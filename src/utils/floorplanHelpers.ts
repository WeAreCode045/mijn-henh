
import { PropertyFloorplan } from "@/types/property";

/**
 * Creates a floorplan object from URL
 */
export function createFloorplanFromUrl(url: string, index: number): PropertyFloorplan {
  return {
    id: `floorplan-${Date.now()}-${index}`,
    url,
    sort_order: index,
    type: "floorplan"
  };
}

/**
 * Ensures a consistent property floorplan object
 */
export function normalizeFloorplan(floorplan: any): PropertyFloorplan {
  return {
    id: floorplan.id || `floorplan-${Date.now()}-${Math.random()}`,
    url: floorplan.url || '',
    title: floorplan.title,
    alt: floorplan.alt,
    description: floorplan.description,
    sort_order: floorplan.sort_order || 0,
    type: "floorplan",
    columns: floorplan.columns || 1
  };
}
