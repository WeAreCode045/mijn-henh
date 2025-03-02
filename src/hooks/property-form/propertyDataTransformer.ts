
import type { PropertyFeature, PropertyArea, PropertyFloorplan, PropertyPlaceType } from "@/types/property";

export function transformFeatures(features: any[]): PropertyFeature[] {
  return Array.isArray(features)
    ? features.map((feature: any) => ({
        id: feature.id || String(Date.now()),
        description: feature.description || ""
      }))
    : [];
}

export function transformAreas(areas: any[]): PropertyArea[] {
  return Array.isArray(areas)
    ? areas.map((area: any) => ({
        id: area.id || crypto.randomUUID(),
        title: area.title || "",
        description: area.description || "",
        imageIds: Array.isArray(area.imageIds) ? area.imageIds : [],
        columns: typeof area.columns === 'number' ? area.columns : 2
      }))
    : [];
}

export function transformFloorplans(floorplans: any[]): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) return [];
  
  return floorplans.map((floorplan: any) => {
    if (typeof floorplan === 'string') {
      try {
        // Try to parse as JSON if it's a stringified object
        const parsedFloorplan = JSON.parse(floorplan);
        return {
          id: parsedFloorplan.id || crypto.randomUUID(),
          url: parsedFloorplan.url || '',
          filePath: parsedFloorplan.filePath || '', 
          columns: typeof parsedFloorplan.columns === 'number' ? parsedFloorplan.columns : 1
        };
      } catch (e) {
        // If parsing fails, treat it as a plain URL string
        return { 
          id: crypto.randomUUID(),
          url: floorplan, 
          filePath: '', 
          columns: 1 
        };
      }
    } else if (typeof floorplan === 'object' && floorplan !== null) {
      // If it's already an object
      return {
        id: floorplan.id || crypto.randomUUID(),
        url: floorplan.url || '',
        filePath: floorplan.filePath || '',
        columns: typeof floorplan.columns === 'number' ? floorplan.columns : 1
      };
    } else {
      // Fallback for any other case
      return { 
        id: crypto.randomUUID(),
        url: '', 
        filePath: '',
        columns: 1 
      };
    }
  }).filter(f => f.url); // Filter out any items with empty URLs
}

export function transformNearbyPlaces(places: any[]): PropertyPlaceType[] {
  return Array.isArray(places)
    ? places.map((place: any) => ({
        id: place.id || "",
        name: place.name || "",
        type: place.type || "",
        vicinity: place.vicinity || "",
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0
      }))
    : [];
}
