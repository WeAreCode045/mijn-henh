
import { PropertyData, PropertyFeature, PropertyPlaceType, PropertyCity, PropertyArea, PropertyAgent } from "@/types/property";
import { GeneralInfoData } from "@/types/property/PropertyTypes";

/**
 * Transforms raw features data to PropertyFeature[] type
 */
export const transformFeatures = (features: any[]): PropertyFeature[] => {
  return features.map(feature => ({
    id: feature.id || `feature-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    description: feature.description || feature.name || ''
  }));
};

/**
 * Transforms raw areas data to PropertyArea[] type
 */
export const transformAreas = (areas: any[]): PropertyArea[] => {
  return areas.map(area => ({
    id: area.id || `area-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    name: area.name || '',
    size: area.size || '',
    unit: area.unit || '',
    title: area.title || area.name || '',
    description: area.description || '',
    images: Array.isArray(area.images) ? area.images : [],
    imageIds: Array.isArray(area.imageIds) ? area.imageIds : [],
    columns: area.columns || 2
  }));
};

/**
 * Transforms raw nearby places data to PropertyPlaceType[] type
 */
export const transformNearbyPlaces = (places: any[]): PropertyPlaceType[] => {
  return places.map(place => ({
    id: place.id || `place-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    place_id: place.place_id || place.id || '',
    name: place.name || '',
    type: place.type || '',
    types: place.types || [place.type || ''],
    vicinity: place.vicinity || place.address || '',
    rating: place.rating,
    user_ratings_total: place.user_ratings_total,
    distance: place.distance || 0,
    visible_in_webview: place.visible_in_webview !== undefined ? place.visible_in_webview : true
  }));
};

/**
 * Transforms raw nearby cities data to PropertyCity[] type
 */
export const transformNearbyCities = (cities: any[]): PropertyCity[] => {
  return cities.map(city => ({
    id: city.id || `city-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    name: city.name || '',
    distance: city.distance || 0,
    visible_in_webview: city.visible_in_webview !== undefined ? city.visible_in_webview : true,
    description: city.description || '',
    image: city.image || ''
  }));
};

/**
 * Transforms raw agent data to PropertyAgent type
 */
export const transformAgent = (agent: any): PropertyAgent | null => {
  if (!agent) return null;
  
  return {
    id: agent.id || '',
    name: agent.name || agent.full_name || 'Unknown Agent',
    email: agent.email || '',
    phone: agent.phone || '',
    photoUrl: agent.photoUrl || agent.avatar_url || '',
    address: agent.address || ''
  };
};

/**
 * Transforms raw general info data to GeneralInfoData type
 */
export const transformGeneralInfo = (data: any): GeneralInfoData | undefined => {
  if (!data) return undefined;
  
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    // Ensure it has the required structure
    return {
      propertyDetails: parsedData.propertyDetails || {},
      description: parsedData.description || {},
      keyInformation: parsedData.keyInformation || {},
      ...parsedData
    };
  } catch (e) {
    console.error("Error transforming general info:", e);
    return {
      propertyDetails: {},
      description: {},
      keyInformation: {}
    };
  }
};
