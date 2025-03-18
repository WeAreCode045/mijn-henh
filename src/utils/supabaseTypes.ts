
// Define Json type that matches Supabase's JSON handling
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Helper to convert any value to JSON string
export const jsonToString = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
};

// Helper to ensure array is properly formatted for JSON
export const asJsonArray = (value: any[]): Json[] => {
  return value as Json[];
};

// Safely parse JSON string to a specific type
export function safeJsonParse<T>(jsonString: string | undefined | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return defaultValue;
  }
}
