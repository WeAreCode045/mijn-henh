
import type { PropertyArea } from "@/types/property";
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
 * Prepare property properties for JSON field
 * Works with any array of objects or primitive values
 * Returns Json type compatible with Supabase
 */
export function preparePropertiesForJsonField(properties: any[]): Json {
  if (!properties || !Array.isArray(properties)) {
    return [];
  }
  return properties as Json;
}

/**
 * Prepare floorplans for JSON field
 * This is a compatibility function to keep the API consistent
 */
export function prepareFloorplansForFormSubmission(floorplans: any[]): Json {
  return preparePropertiesForJsonField(floorplans || []);
}
