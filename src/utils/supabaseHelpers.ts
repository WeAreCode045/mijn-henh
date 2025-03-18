
import { Json } from "@supabase/supabase-js";
import { PropertyCity, PropertyArea, PropertyFeature, PropertyPlaceType } from "@/types/property";

/**
 * Safely converts an array of objects to a format compatible with Supabase's JSON storage
 */
export function prepareArrayForSupabase<T>(array: T[]): Json[] {
  return array as unknown as Json[];
}

/**
 * Converts an array of objects to a JSON string for Supabase
 */
export function convertToJsonString<T>(array: T[]): string {
  return JSON.stringify(array);
}

/**
 * Parses JSON data from Supabase into a typed array
 */
export function parseJsonArray<T>(jsonData: string | null | undefined, defaultValue: T[] = []): T[] {
  if (!jsonData) return defaultValue;
  
  try {
    const parsed = JSON.parse(jsonData);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (e) {
    console.error("Error parsing JSON array:", e);
    return defaultValue;
  }
}

/**
 * Type-specific parsers for different property data types
 */
export const parsePropertyFeatures = (json: string | null | undefined): PropertyFeature[] => 
  parseJsonArray<PropertyFeature>(json, []);

export const parsePropertyAreas = (json: string | null | undefined): PropertyArea[] => 
  parseJsonArray<PropertyArea>(json, []);

export const parsePropertyPlaceTypes = (json: string | null | undefined): PropertyPlaceType[] => 
  parseJsonArray<PropertyPlaceType>(json, []);

export const parsePropertyCities = (json: string | null | undefined): PropertyCity[] => 
  parseJsonArray<PropertyCity>(json, []);
