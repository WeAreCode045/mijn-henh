
/**
 * Safely parses JSON strings into the expected type
 */
export function safelyParse<T>(jsonString: string | undefined | null, transformer: (data: any) => T): T {
  if (!jsonString) return transformer(null);
  
  try {
    const parsed = JSON.parse(jsonString);
    return transformer(parsed);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return transformer(null);
  }
}

/**
 * Extracts the property ID from various input types
 */
export function extractPropertyId(propertyId: string | any): string {
  if (typeof propertyId === 'string') {
    return propertyId;
  } 
  
  if (propertyId && typeof propertyId === 'object' && 'id' in propertyId) {
    return propertyId.id as string;
  }
  
  return '';
}

/**
 * Checks if a property ID is empty or invalid
 */
export function isPropertyIdEmpty(id: string): boolean {
  return !id || id.trim() === '';
}
