
import { PropertyFloorplan } from "@/types/property";

// Convert a URL string to a PropertyFloorplan object
export function urlToFloorplan(url: string): PropertyFloorplan {
  return {
    id: `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url,
    type: "floorplan",
    sort_order: 0
  };
}

// Convert a mixed object to a normalized PropertyFloorplan
export function toFloorplan(floorplan: string | PropertyFloorplan | any): PropertyFloorplan {
  if (typeof floorplan === 'string') {
    return urlToFloorplan(floorplan);
  }
  
  return {
    id: floorplan.id || `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: floorplan.url || '',
    title: floorplan.title,
    alt: floorplan.alt,
    description: floorplan.description,
    sort_order: floorplan.sort_order || 0,
    property_id: floorplan.property_id,
    type: "floorplan"
  };
}
