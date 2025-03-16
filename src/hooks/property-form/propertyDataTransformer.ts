
import type { PropertyFeature, PropertyArea, PropertyImage, PropertyPlaceType, GeneralInfoData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { normalizeImage } from "@/utils/imageHelpers";

export function transformFeatures(features: any[]): PropertyFeature[] {
  return Array.isArray(features)
    ? features.map((feature: any) => ({
        id: feature.id || String(Date.now()),
        description: feature.description || ""
      }))
    : [];
}

export function transformAreas(areas: any[]): PropertyArea[] {
  return Array.isArray(areas)
    ? areas.map((area: any) => {
        // Ensure imageIds is always processed to a valid array
        let imageIds: string[] = [];
        
        if (area.imageIds) {
          if (Array.isArray(area.imageIds)) {
            // Already an array, use it directly
            imageIds = area.imageIds;
          } else if (typeof area.imageIds === 'string') {
            try {
              // Try to parse as JSON
              const parsed = JSON.parse(area.imageIds);
              imageIds = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              // If parsing fails, treat as comma-separated or single value
              imageIds = area.imageIds.includes(',') 
                ? area.imageIds.split(',').map((id: string) => id.trim())
                : [area.imageIds];
            }
          } else if (typeof area.imageIds === 'object' && area.imageIds !== null) {
            // Handle any other object-like value
            console.log("Object-like imageIds, trying to extract values:", area.imageIds);
            try {
              // Try to get values if it's an object with values
              const values = Object.values(area.imageIds);
              if (values.length > 0) {
                imageIds = values.map(v => String(v));
              }
            } catch (err) {
              console.error("Error extracting values from imageIds object:", err);
            }
          }
        }
        
        // Process area images - ensure it's an array of PropertyImage
        const processedImages = Array.isArray(area.images) 
          ? area.images.map((img: any) => normalizeImage(img))
          : [];
        
        return {
          id: area.id || crypto.randomUUID(),
          title: area.title || "",
          description: area.description || "",
          imageIds: imageIds,
          columns: typeof area.columns === 'number' ? area.columns : 2,
          name: area.name || "",
          size: area.size || "",
          images: processedImages
        };
      })
    : [];
}

export function transformNearbyPlaces(places: any[]): PropertyPlaceType[] {
  return Array.isArray(places)
    ? places.map((place: any) => ({
        id: place.id || "",
        name: place.name || "",
        type: place.type || "other",
        types: place.types || [place.type || "other"], // Ensure types exists
        vicinity: place.vicinity || "",
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        visible_in_webview: place.visible_in_webview || false,
        distance: place.distance || 0
      }))
    : [];
}

export function transformImages(images: any[]): PropertyImage[] {
  return Array.isArray(images)
    ? images.map((img: any) => normalizeImage(img))
    : [];
}

// Helper to transform GeneralInfoData
export function transformGeneralInfo(data: any): GeneralInfoData | undefined {
  if (!data) return undefined;
  
  if (typeof data === 'object' && !Array.isArray(data)) {
    // It's already an object, check if it looks like GeneralInfoData
    if ('propertyDetails' in data || 'description' in data || 'keyInformation' in data) {
      return data as GeneralInfoData;
    }
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as GeneralInfoData;
      }
    } catch (e) {
      // Return undefined if parsing fails
      return undefined;
    }
  }
  
  // Default empty object with the expected structure
  return {
    propertyDetails: {},
    description: {},
    keyInformation: {}
  };
}
