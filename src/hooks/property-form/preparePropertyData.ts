
import { PropertyFormData, PropertyArea, PropertyNearbyPlace, PropertyFeature, AreaImage } from '@/types/property';
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
    const columns = (area as any).columns || 2; // Default to 2 columns if not specified
    const name = (area as any).name || '';
    const size = (area as any).size || '';
    
    // Handle the new areaImages format
    const areaImages = (area as any).areaImages || [];
    
    // Handle legacy fields for backward compatibility
    const images = (area as any).images || [];
    const imageIds = (area as any).imageIds || [];
    
    return {
      id,
      title,
      description,
      columns,
      name,
      size,
      areaImages,
      images,
      imageIds
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
function prepareFloorplansForFormSubmission(floorplans: any[]): Json {
  return preparePropertiesForJsonField(floorplans || []);
}
