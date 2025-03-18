
// Define the Json type that matches Supabase's Json type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Helper function to safely parse JSON string to object
export function safelyParseJson<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return defaultValue;
  }
}

// Function to convert Supabase JSON to PropertyCity[]
export function parsePropertyCities(jsonData: any): any[] {
  if (!jsonData) return [];
  
  try {
    if (typeof jsonData === 'string') {
      return JSON.parse(jsonData);
    }
    if (Array.isArray(jsonData)) {
      return jsonData;
    }
    return [];
  } catch (e) {
    console.error("Error parsing cities:", e);
    return [];
  }
}

// Helper functions
export function parsePropertyFeatures(jsonData: any): any[] {
  return parseJsonToArray(jsonData);
}

export function parsePropertyAreas(jsonData: any): any[] {
  return parseJsonToArray(jsonData);
}

export function parsePropertyPlaceTypes(jsonData: any): any[] {
  return parseJsonToArray(jsonData);
}

function parseJsonToArray(jsonData: any): any[] {
  if (!jsonData) return [];
  
  try {
    if (typeof jsonData === 'string') {
      return JSON.parse(jsonData);
    }
    if (Array.isArray(jsonData)) {
      return jsonData;
    }
    return [];
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return [];
  }
}

// Convert to JSON string for storage
export function convertToJsonString(data: any): string {
  if (typeof data === 'string') {
    return data; // Already a string
  }
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error("Error converting to JSON string:", e);
    return JSON.stringify([]);
  }
}
