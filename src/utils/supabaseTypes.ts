
// Define a Json type to match Supabase's Json type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Helper to convert various types to Json[]
export function asJsonArray(value: any): Json[] {
  if (Array.isArray(value)) return value as Json[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as Json[];
      return [parsed] as Json[];
    } catch (e) {
      return [value] as Json[];
    }
  }
  return [] as Json[];
}

// Helper to safely parse JSON
export function safeJsonParse<T>(value: string | null | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    return defaultValue;
  }
}

// Convert Json to string for database operations
export function jsonToString(value: any): string {
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}
