
import type { PropertyArea, PropertyFloorplan } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

/**
 * Transforms array of area objects into JSON array for database storage
 */
export function prepareAreasForFormSubmission(areas: PropertyArea[]): Json[] {
  if (!areas || !Array.isArray(areas)) return [];
  
  return areas.map(area => ({
    id: area.id,
    title: area.title,
    description: area.description,
    imageIds: area.imageIds,
    columns: area.columns || 2 // Default to 2 columns if not specified
  }));
}

/**
 * Transforms floorplan objects array into JSON for database storage
 */
export function prepareFloorplansForFormSubmission(floorplans: PropertyFloorplan[]): Json {
  if (!floorplans || !Array.isArray(floorplans)) return [];
  
  // Convert floorplan objects to proper format for database
  return floorplans.map(floorplan => ({
    url: floorplan.url,
    columns: floorplan.columns || 1 // Default to 1 column if not specified
  }));
}

/**
 * Prepare property properties for JSON field
 */
export function preparePropertiesForJsonField(properties: any[]): Json {
  if (!properties || !Array.isArray(properties)) {
    return [];
  }
  return properties;
}
