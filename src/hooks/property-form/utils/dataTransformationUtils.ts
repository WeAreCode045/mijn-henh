
import { PropertyFormData } from "@/types/property";

/**
 * Extracts a property ID from various formats
 */
export const extractPropertyId = (propertyId: string | any): string => {
  if (typeof propertyId === 'string') {
    return propertyId;
  }
  
  if (propertyId && typeof propertyId === 'object' && 'id' in propertyId) {
    return propertyId.id;
  }
  
  return '';
};

/**
 * Checks if a property ID is empty
 */
export const isPropertyIdEmpty = (id: string): boolean => {
  return !id || id.trim() === '';
};

/**
 * Safely parses JSON or returns default value
 */
export const safelyParse = <T,>(value: string | undefined | null, transformer: (val: any) => T): T => {
  if (!value) return transformer([]);
  
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return transformer(parsed);
  } catch (e) {
    console.error('Error parsing:', e);
    return transformer([]);
  }
};

/**
 * Checks if a form has pending changes
 */
export const hasFormChanges = (formData: PropertyFormData, originalData: PropertyFormData): boolean => {
  return JSON.stringify(formData) !== JSON.stringify(originalData);
};

/**
 * Determines if we should fetch property data based on current state
 */
export const shouldFetchProperty = (
  id: string | undefined, 
  isLoading: boolean,
  formData: PropertyFormData
): boolean => {
  return !!id && !isLoading && !formData.id;
};
