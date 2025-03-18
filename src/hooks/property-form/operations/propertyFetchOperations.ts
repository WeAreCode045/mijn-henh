
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData, PropertyFeature, PropertyArea, PropertyPlaceType, PropertyCity } from '@/types/property';
import { safelyParse, extractPropertyId, isPropertyIdEmpty } from '../utils/dataTransformationUtils';
import { 
  transformFeatures, 
  transformAreas, 
  transformNearbyPlaces, 
  transformGeneralInfo 
} from '../propertyDataTransformer';
import { 
  parsePropertyCities, 
  parsePropertyFeatures, 
  parsePropertyAreas, 
  parsePropertyPlaceTypes 
} from '@/utils/supabaseJsonTypes';
import { Json } from '@/utils/supabaseJsonTypes';

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
  
  // Parse and transform the property data
  const features = transformFeatures(parsePropertyFeatures(data.features));
  const areas = transformAreas(parsePropertyAreas(data.areas));
  const nearbyPlaces = transformNearbyPlaces(parsePropertyPlaceTypes(data.nearby_places));
  
  // Parse nearby cities with our helper
  const nearbyCities = parsePropertyCities(data.nearby_cities);
  
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
    shortDescription: data.description || '', // Fallback to description
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
    propertyType: data.propertyType || '', // Default to empty string
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
