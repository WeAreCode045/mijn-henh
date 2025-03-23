
import { PropertyFormData } from "@/types/property";

/**
 * Prepares areas data for form submission by formatting it appropriately for storage
 */
export const prepareAreasForFormSubmission = (areas: any[]) => {
  if (!areas || !Array.isArray(areas)) return [];
  
  return JSON.stringify(areas.map(area => ({
    ...area,
    images: Array.isArray(area.images) ? area.images : []
  })));
};

/**
 * Prepares properties JSON fields for database submission
 */
export const preparePropertiesForJsonField = <T extends any[]>(data: T): string => {
  if (!data || !Array.isArray(data)) return JSON.stringify([]);
  return JSON.stringify(data);
};

/**
 * Prepares a single field value for database submission based on field type
 */
export const prepareFieldForSubmission = <K extends keyof PropertyFormData>(
  field: K, 
  value: PropertyFormData[K]
): any => {
  // Special handling for specific field types
  if (field === 'features' && Array.isArray(value)) {
    return JSON.stringify(value);
  } else if (field === 'areas' && Array.isArray(value)) {
    return prepareAreasForFormSubmission(value as any);
  } else if ((field === 'nearby_places' || field === 'nearby_cities') && Array.isArray(value)) {
    return preparePropertiesForJsonField(value as any);
  }
  
  // Return the value as is for other fields
  return value;
};
