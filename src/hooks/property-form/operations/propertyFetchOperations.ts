
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData, PropertyFeature, PropertyArea, PropertyPlaceType, PropertyCity } from '@/types/property';
import { safelyParse, extractPropertyId, isPropertyIdEmpty } from '../utils/dataTransformationUtils';
import { 
  transformFeatures, 
  transformAreas, 
  transformNearbyPlaces, 
  transformGeneralInfo 
} from '../propertyDataTransformer';
import { safeJsonParse, jsonToString, Json } from '@/utils/supabaseTypes';

/**
 * Fetches property data from Supabase
 */
export const fetchPropertyDataFromApi = async (propertyId: string | any): Promise<PropertyFormData | null> => {
  // Ensure propertyId is a string
  const id = extractPropertyId(propertyId);
  
  // Log the ID for debugging purposes
  console.log("Attempting to fetch property with ID:", id);
  
  // If the ID is empty, exit early
  if (isPropertyIdEmpty(id)) {
    console.warn('Empty property ID provided:', propertyId);
    return null;
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw error;
  }
  
  if (!data) {
    console.warn('No data found for property ID:', id);
    return null;
  }
  
  // Parse and transform the property data - convert from JSON strings to objects
  // Use type casting to safely convert JSON to our expected types
  const features = transformFeatures(safeJsonParse<any[]>(data.features as string, []));
  const areas = transformAreas(safeJsonParse<any[]>(data.areas as string, []));
  const nearbyPlaces = transformNearbyPlaces(safeJsonParse<any[]>(data.nearby_places as string, []));
  
  // Parse nearby cities with our helper
  const nearbyCities = safeJsonParse<PropertyCity[]>(data.nearby_cities as string, []);
  
  const generalInfo = transformGeneralInfo(data.generalInfo);
  
  // Build and return the property form data
  return {
    id: data.id,
    title: data.title || '',
    price: data.price || '',
    address: data.address || '',
    bedrooms: data.bedrooms || '',
    bathrooms: data.bathrooms || '',
    sqft: data.sqft || '',
    livingArea: data.livingArea || '',
    buildYear: data.buildYear || '',
    garages: data.garages || '',
    energyLabel: data.energyLabel || '',
    hasGarden: !!data.hasGarden,
    description: data.description || '',
    shortDescription: data.description || '', // Use description as fallback since shortDescription might not exist
    location_description: data.location_description || '',
    features,
    areas,
    nearby_places: nearbyPlaces,
    nearby_cities: nearbyCities,
    latitude: data.latitude !== undefined ? data.latitude : null,
    longitude: data.longitude !== undefined ? data.longitude : null,
    object_id: data.object_id || '',
    agent_id: data.agent_id || '',
    template_id: data.template_id || '',
    floorplanEmbedScript: data.floorplanEmbedScript || '',
    virtualTourUrl: data.virtualTourUrl || '',
    youtubeUrl: data.youtubeUrl || '',
    notes: data.notes || '',
    propertyType: data.property_type || '', // Use property_type field name to match database
    generalInfo,
    images: [],
    floorplans: [],
    featuredImage: null,
    featuredImages: [],
    coverImages: [],
    gridImages: [],
    map_image: null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    areaPhotos: []
  };
};
