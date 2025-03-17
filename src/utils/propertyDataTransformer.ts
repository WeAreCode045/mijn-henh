
import { PropertyFormData, PropertyData, PropertyImage, PropertyArea, PropertyFeature, PropertyPlaceType, PropertyCity, GeneralInfoData } from "@/types/property";
import { normalizeImage } from "./imageHelpers";
import { toPropertyImage } from "./imageUtils";
import { Json } from "@/integrations/supabase/types";

/**
 * Transform property features safely
 */
export function transformFeatures(features: any[]): PropertyFeature[] {
  return Array.isArray(features)
    ? features.map((feature: any) => ({
        id: feature.id || String(Date.now()) + Math.random().toString(36).substring(2, 9),
        description: feature.description || ""
      }))
    : [];
}

/**
 * Transform property areas safely
 */
export function transformAreas(areas: any[]): PropertyArea[] {
  return Array.isArray(areas)
    ? areas.map((area: any) => {
        // Process imageIds
        let imageIds: string[] = [];
        
        if (area.imageIds) {
          if (Array.isArray(area.imageIds)) {
            imageIds = area.imageIds;
          } else if (typeof area.imageIds === 'string') {
            try {
              const parsed = JSON.parse(area.imageIds);
              imageIds = Array.isArray(parsed) ? parsed : [area.imageIds];
            } catch {
              imageIds = area.imageIds.includes(',') 
                ? area.imageIds.split(',').map((id: string) => id.trim())
                : [area.imageIds];
            }
          }
        }
        
        // Process area images
        const processedImages = Array.isArray(area.images) 
          ? area.images.map((img: any) => {
              if (typeof img === 'string') return img;
              return toPropertyImage(img);
            })
          : [];
        
        return {
          id: area.id || crypto.randomUUID(),
          title: area.title || "",
          description: area.description || "",
          name: area.name || "",
          size: area.size || "",
          unit: area.unit || "",
          imageIds: imageIds,
          columns: typeof area.columns === 'number' ? area.columns : 2,
          images: processedImages
        };
      })
    : [];
}

/**
 * Transform nearby places safely
 */
export function transformNearbyPlaces(places: any[]): PropertyPlaceType[] {
  return Array.isArray(places)
    ? places.map((place: any) => ({
        id: place.id || place.place_id || crypto.randomUUID(),
        place_id: place.place_id || place.id || crypto.randomUUID(),
        name: place.name || "",
        type: place.type || "other",
        types: place.types || [place.type || "other"],
        vicinity: place.vicinity || "",
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        visible_in_webview: place.visible_in_webview || false,
        distance: place.distance || 0
      }))
    : [];
}

/**
 * Transform nearby cities safely
 */
export function transformNearbyCities(cities: any[]): PropertyCity[] {
  return Array.isArray(cities)
    ? cities.map((city: any) => ({
        id: city.id || crypto.randomUUID(),
        name: city.name || "",
        distance: city.distance || 0,
        visible_in_webview: city.visible_in_webview || false,
        description: city.description || "",
        image: city.image || null
      }))
    : [];
}

/**
 * Transform images safely
 */
export function transformImages(images: any[]): PropertyImage[] {
  return Array.isArray(images)
    ? images.map((img: any) => normalizeImage(img))
    : [];
}

/**
 * Transform general info safely
 */
export function transformGeneralInfo(data: any): GeneralInfoData | undefined {
  if (!data) return undefined;
  
  if (typeof data === 'object' && !Array.isArray(data)) {
    return data as GeneralInfoData;
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as GeneralInfoData;
      }
    } catch (e) {
      // Return default if parsing fails
    }
  }
  
  // Default empty object with the expected structure
  return {
    propertyDetails: {},
    description: {},
    keyInformation: {}
  };
}

/**
 * Helper to safely convert JSON strings to objects
 */
export function safeParseJson<T>(jsonString: string | undefined | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Convert Supabase JSON to typed objects
 */
export function convertSupabaseJson<T>(data: Json | Json[] | null, transform: (items: any[]) => T[]): T[] {
  if (!data) return [] as T[];
  
  if (Array.isArray(data)) {
    return transform(data);
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return transform(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      return [] as T[];
    }
  }
  
  return [] as T[];
}
