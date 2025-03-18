
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
  const features = transformFeatures(safeJsonParse<any[]>(data.features as unknown as string, []));
  const areas = transformAreas(safeJsonParse<any[]>(data.areas as unknown as string, []));
  const nearbyPlaces = transformNearbyPlaces(safeJsonParse<any[]>(data.nearby_places as unknown as string, []));
  
  // Parse nearby cities with our helper
  const nearbyCities = safeJsonParse<PropertyCity[]>(data.nearby_cities as unknown as string, []);
  
  const generalInfo = transformGeneralInfo(data.generalInfo);
  
  // Building the data object with proper typings and property names
  const typedData = data as any; // Use type assertion for flexibility
  
  // Build and return the property form data
  return {
    id: typedData.id,
    title: typedData.title || '',
    price: typedData.price || '',
    address: typedData.address || '',
    bedrooms: typedData.bedrooms || '',
    bathrooms: typedData.bathrooms || '',
    sqft: typedData.sqft || '',
    livingArea: typedData.livingArea || '',
    buildYear: typedData.buildYear || '',
    garages: typedData.garages || '',
    energyLabel: typedData.energyLabel || '',
    hasGarden: !!typedData.hasGarden,
    description: typedData.description || '',
    shortDescription: typedData.shortDescription || typedData.description || '', // Use description as fallback
    location_description: typedData.location_description || '',
    features,
    areas,
    nearby_places: nearbyPlaces,
    nearby_cities: nearbyCities,
    latitude: typedData.latitude !== undefined ? typedData.latitude : null,
    longitude: typedData.longitude !== undefined ? typedData.longitude : null,
    object_id: typedData.object_id || '',
    agent_id: typedData.agent_id || '',
    template_id: typedData.template_id || '',
    floorplanEmbedScript: typedData.floorplanEmbedScript || '',
    virtualTourUrl: typedData.virtualTourUrl || '',
    youtubeUrl: typedData.youtubeUrl || '',
    notes: typedData.notes || '',
    propertyType: typedData.property_type || typedData.propertyType || '', // Map database field to our property
    created_at: typedData.created_at || new Date().toISOString(),
    updated_at: typedData.updated_at || new Date().toISOString(),
    images: [], // These will be populated elsewhere
    floorplans: [],
    featuredImage: null,
    featuredImages: [],
    coverImages: [],
    gridImages: [],
    map_image: null,
    areaPhotos: []
  };
};
