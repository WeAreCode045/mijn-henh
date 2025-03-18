
// Helper to safely extract property ID
export function extractPropertyId(propertyId: string | any): string {
  // Handle different types to ensure we return a string or empty string
  if (typeof propertyId === 'string') return propertyId;
  if (propertyId && typeof propertyId === 'object' && propertyId.id) return propertyId.id.toString();
  return '';
}

// Check if property ID is empty
export function isPropertyIdEmpty(id: string): boolean {
  return !id || id.trim() === '';
}

// Helper to safely parse JSON
export function safelyParse<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return defaultValue;
  }
}

// Determine if we should fetch property data
export function shouldFetchProperty(id: string | undefined): boolean {
  return id !== undefined && id !== null && id !== '';
}
