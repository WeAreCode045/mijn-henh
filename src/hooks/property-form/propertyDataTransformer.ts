import type { PropertyFeature, PropertyArea, PropertyNearbyPlace, PropertyImage, PropertyPlaceType, PropertyCity } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { normalizeImage } from "@/utils/imageHelpers";

export function transformFeatures(features: any): PropertyFeature[] {
  // Ensure we're working with an array
  if (!features) return [];
  
  // Try to convert to array if it's not already
  let featuresArray: any[] = [];
  
  if (Array.isArray(features)) {
    featuresArray = features;
  } else if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      featuresArray = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      featuresArray = [features]; // Treat as single feature if parsing fails
    }
  } else if (typeof features === 'object' && features !== null) {
    featuresArray = [features]; // Single object case
  }
  
  // Map to ensure consistent structure
  return featuresArray.map((feature: any) => ({
    id: feature.id || String(Date.now()),
    description: feature.description || ""
  }));
}

export function transformAreas(areas: any): PropertyArea[] {
  // Ensure we're working with an array
  if (!areas) return [];
  
  // Try to convert to array if it's not already
  let areasArray: any[] = [];
  
  if (Array.isArray(areas)) {
    areasArray = areas;
  } else if (typeof areas === 'string') {
    try {
      const parsed = JSON.parse(areas);
      areasArray = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return []; // Return empty array if parsing fails
    }
  } else if (typeof areas === 'object' && areas !== null) {
    areasArray = [areas]; // Single object case
  }
  
  // Map to ensure consistent structure
  return areasArray.map((area: any) => {
    // Ensure area has all required properties
    return {
      id: area.id || crypto.randomUUID(),
      title: area.title || "",
      description: area.description || "",
      name: area.name || "",
      size: area.size || "",
      imageIds: Array.isArray(area.imageIds) ? area.imageIds : [],
      columns: typeof area.columns === 'number' ? area.columns : 2,
      images: Array.isArray(area.images) ? area.images.map((img: any) => normalizeImage(img)) : []
    };
  });
}

export function transformNearbyPlaces(places: any): PropertyNearbyPlace[] {
  // Ensure we're working with an array
  if (!places) return [];
  
  // Try to convert to array if it's not already
  let placesArray: any[] = [];
  
  if (Array.isArray(places)) {
    placesArray = places;
  } else if (typeof places === 'string') {
    try {
      const parsed = JSON.parse(places);
      placesArray = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return []; // Return empty array if parsing fails
    }
  } else if (typeof places === 'object' && places !== null) {
    placesArray = [places]; // Single object case
  }
  
  // Map to ensure consistent structure
  return placesArray.map((place: any) => ({
    id: place.id || "",
    name: place.name || "",
    type: place.type || "other",
    vicinity: place.vicinity || "",
    rating: place.rating || 0,
    user_ratings_total: place.user_ratings_total || 0,
    visible_in_webview: place.visible_in_webview || false,
    distance: place.distance || 0
  }));
}

export function transformNearbyCities(cities: any): PropertyCity[] {
  // Ensure we're working with an array
  if (!cities) return [];
  
  // Try to convert to array if it's not already
  let citiesArray: any[] = [];
  
  if (Array.isArray(cities)) {
    citiesArray = cities;
  } else if (typeof cities === 'string') {
    try {
      const parsed = JSON.parse(cities);
      citiesArray = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return []; // Return empty array if parsing fails
    }
  } else if (typeof cities === 'object' && cities !== null) {
    citiesArray = [cities]; // Single object case
  }
  
  // Map to ensure consistent structure
  return citiesArray.map((city: any) => ({
    id: city.id || String(Date.now()),
    name: city.name || "",
    distance: city.distance || "",
    visible_in_webview: city.visible_in_webview || false
  }));
}

export function transformImages(images: any[]): PropertyImage[] {
  return Array.isArray(images)
    ? images.map((img: any) => normalizeImage(img))
    : [];
}

export function transformMetadata(metadata: any): { [key: string]: unknown; status?: string } {
  // If metadata is null or undefined, return an empty object
  if (!metadata) return {};
  
  // If metadata is a string, try to parse it as JSON
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return typeof parsed === 'object' && parsed !== null ? parsed : { status: metadata };
    } catch (e) {
      // If parsing fails, return an object with status set to the string value
      return { status: metadata };
    }
  }
  
  // If metadata is already an object, return it as is
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata;
  }
  
  // Default case, return an empty object
  return {};
}
