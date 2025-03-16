
import type { PropertyArea } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

/**
 * Transforms array of area objects into JSON array for database storage
 * Updated to properly handle PropertyArea to Json conversion
 */
export function prepareAreasForFormSubmission(areas: PropertyArea[] | Json[]): Json[] {
  if (!areas || !Array.isArray(areas)) return [];
  
  return areas.map(area => {
    // Check if the area is already a primitive Json type
    if (typeof area === 'string' || typeof area === 'number' || typeof area === 'boolean' || area === null) {
      return area;
    }
    
    // Handle both PropertyArea and Json object types
    const areaObj = area as any;
    
    // Create a simple record object that conforms to Json type
    const jsonObject: Record<string, Json> = {};
    
    // Add all properties that exist on the area object
    if ('id' in areaObj) jsonObject.id = areaObj.id || '';
    if ('title' in areaObj) jsonObject.title = areaObj.title || '';
    if ('description' in areaObj) jsonObject.description = areaObj.description || '';
    if ('columns' in areaObj) jsonObject.columns = areaObj.columns || 2;
    if ('name' in areaObj) jsonObject.name = areaObj.name || '';
    if ('size' in areaObj) jsonObject.size = areaObj.size || '';
    
    // Handle images array
    if ('images' in areaObj && Array.isArray(areaObj.images)) {
      jsonObject.images = areaObj.images;
    } else {
      jsonObject.images = [];
    }
    
    // Handle imageIds array
    if ('imageIds' in areaObj && Array.isArray(areaObj.imageIds)) {
      jsonObject.imageIds = areaObj.imageIds;
    }
    
    return jsonObject as Json;
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
 * Prepare images for submission
 * Converts image objects to URLs
 */
export function prepareImagesForSubmission(images: any[]): string[] {
  if (!images || !Array.isArray(images)) {
    return [];
  }
  
  return images.map(img => {
    if (typeof img === 'string') return img;
    if (img && typeof img === 'object' && 'url' in img) return img.url;
    return '';
  }).filter(url => url !== '');
}

/**
 * Prepare floorplans for JSON field
 * This is a compatibility function to keep the API consistent
 */
export function prepareFloorplansForFormSubmission(floorplans: any[]): Json {
  return preparePropertiesForJsonField(floorplans || []);
}
