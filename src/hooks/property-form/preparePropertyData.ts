
import type { PropertyArea, PropertyFloorplan } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

/**
 * Transforms array of area objects into JSON array for database storage
 * Updated to support both PropertyArea[] and Json[] input types
 */
export function prepareAreasForFormSubmission(areas: PropertyArea[] | Json[]): Json[] {
  if (!areas || !Array.isArray(areas)) return [];
  
  return areas.map(area => {
    // Check if the area is already a Json object
    if (typeof area === 'string' || typeof area === 'number' || typeof area === 'boolean' || area === null) {
      return area;
    }
    
    // Handle both PropertyArea and Json object types
    const id = (area as any).id || '';
    const title = (area as any).title || '';
    const description = (area as any).description || '';
    const imageIds = (area as any).imageIds || [];
    const columns = (area as any).columns || 2; // Default to 2 columns if not specified
    
    return {
      id,
      title,
      description,
      imageIds,
      columns
    };
  });
}

/**
 * Transforms floorplan objects array into JSON for database storage
 * Note: This is kept for backward compatibility, but we now store floorplans in property_images
 */
export function prepareFloorplansForFormSubmission(floorplans: PropertyFloorplan[] | undefined) {
  if (!floorplans || !Array.isArray(floorplans)) {
    return [];
  }
  
  console.log("prepareFloorplansForFormSubmission - input:", floorplans);
  
  // Filter out any undefined or null values to ensure we only process valid floorplans
  const preparedFloorplans = floorplans
    .filter(floorplan => floorplan && (typeof floorplan === 'string' || floorplan.id))
    .map(floorplan => {
      // If it's a string, it's already in the right format
      if (typeof floorplan === 'string') {
        return floorplan;
      }
      
      // Otherwise, convert it to JSON
      const floorplanData = {
        id: floorplan.id || crypto.randomUUID(), // Ensure we preserve or create an ID
        url: floorplan.url,
        filePath: floorplan.filePath || '',   // Preserve file path for storage operations
        columns: floorplan.columns || 1
      };
      
      return floorplanData;
    });
    
  console.log("prepareFloorplansForFormSubmission - output:", preparedFloorplans);
  return preparedFloorplans;
}

/**
 * Prepare property properties for JSON field
 * Works with any array of objects or primitive values
 */
export function preparePropertiesForJsonField(properties: any[]): Json {
  if (!properties || !Array.isArray(properties)) {
    return [];
  }
  return properties;
}
