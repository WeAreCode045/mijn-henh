
import type { PropertyFeature, PropertyArea, PropertyPlaceType } from "@/types/property";
import { Floorplan } from "@/components/property/form/steps/technical-data/FloorplanUpload";

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
    ? areas.map((area: any) => {
        // Ensure imageIds is always processed to a valid array
        let imageIds: string[] = [];
        
        if (area.imageIds) {
          if (Array.isArray(area.imageIds)) {
            // Already an array, use it directly
            imageIds = area.imageIds;
          } else if (typeof area.imageIds === 'string') {
            try {
              // Try to parse as JSON
              const parsed = JSON.parse(area.imageIds);
              imageIds = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              // If parsing fails, treat as comma-separated or single value
              imageIds = area.imageIds.includes(',') 
                ? area.imageIds.split(',').map((id: string) => id.trim())
                : [area.imageIds];
            }
          } else if (typeof area.imageIds === 'object' && area.imageIds !== null) {
            // Handle any other object-like value
            console.log("Object-like imageIds, trying to extract values:", area.imageIds);
            try {
              // Try to get values if it's an object with values
              const values = Object.values(area.imageIds);
              if (values.length > 0) {
                imageIds = values.map(v => String(v));
              }
            } catch (err) {
              console.error("Error extracting values from imageIds object:", err);
            }
          }
        }
        
        return {
          id: area.id || crypto.randomUUID(),
          title: area.title || "",
          description: area.description || "",
          imageIds: imageIds,
          columns: typeof area.columns === 'number' ? area.columns : 2
        };
      })
    : [];
}

export function transformFloorplans(floorplans: any[]): Floorplan[] {
  if (!Array.isArray(floorplans)) return [];
  
  return floorplans.map((floorplan: any) => {
    if (typeof floorplan === 'string') {
      try {
        // Try to parse as JSON if it's a stringified object
        const parsedFloorplan = JSON.parse(floorplan);
        return {
          id: parsedFloorplan.id || crypto.randomUUID(),
          url: parsedFloorplan.url || '',
          title: parsedFloorplan.title || 'Floorplan'
        };
      } catch (e) {
        // If parsing fails, treat it as a plain URL string
        return { 
          id: crypto.randomUUID(),
          url: floorplan, 
          title: 'Floorplan'
        };
      }
    } else if (typeof floorplan === 'object' && floorplan !== null) {
      // If it's already an object
      return {
        id: floorplan.id || crypto.randomUUID(),
        url: floorplan.url || '',
        title: floorplan.title || 'Floorplan'
      };
    } else {
      // Fallback for any other case
      return { 
        id: crypto.randomUUID(),
        url: '', 
        title: 'Floorplan'
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
