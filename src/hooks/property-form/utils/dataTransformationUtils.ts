
import { PropertyFeature, PropertyArea, PropertyPlaceType, PropertyCity, GeneralInfoData } from '@/types/property';

/**
 * Safely parses and transforms data using a provided transformer function
 */
export const safelyParse = <T,>(data: any, transformer: (data: any[]) => T[]): T[] => {
  if (Array.isArray(data)) {
    return transformer(data);
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return transformer(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Error parsing data:", e);
      return [] as T[];
    }
  }
  
  return [] as T[];
};

/**
 * Extracts property ID from different property ID formats
 */
export const extractPropertyId = (propertyId: string | any): string => {
  return typeof propertyId === 'string' ? propertyId : 
         (propertyId && typeof propertyId === 'object' && propertyId.id) ? 
         propertyId.id : '';
};

/**
 * Validates if a property ID is empty
 */
export const isPropertyIdEmpty = (id: string): boolean => {
  return !id || (typeof id === 'string' && id.trim() === '');
};

/**
 * Checks if a property ID is valid and should trigger a fetch
 */
export const shouldFetchProperty = (propertyId: string | any): boolean => {
  return propertyId && (
    (typeof propertyId === 'string' && propertyId.trim() !== '') ||
    (typeof propertyId === 'object' && propertyId.id && 
     typeof propertyId.id === 'string' && propertyId.id.trim() !== '')
  );
};
