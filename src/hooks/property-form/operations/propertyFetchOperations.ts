
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData, PropertyFeature, PropertyArea, PropertyPlaceType, PropertyCity } from '@/types/property';
import { safelyParse, extractPropertyId, isPropertyIdEmpty } from '../utils/dataTransformationUtils';
import { 
  transformFeatures, 
  transformAreas, 
  transformNearbyPlaces, 
  transformGeneralInfo 
} from '../propertyDataTransformer';

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
  const features = safelyParse<PropertyFeature>(data.features, transformFeatures);
  const areas = safelyParse<PropertyArea>(data.areas, transformAreas);
  const nearbyPlaces = safelyParse<PropertyPlaceType>(data.nearby_places, transformNearbyPlaces);
  
  let nearbyCities: PropertyCity[] = [];
  try {
    if (data.nearby_cities) {
      if (Array.isArray(data.nearby_cities)) {
        nearbyCities = data.nearby_cities;
      } else if (typeof data.nearby_cities === 'string') {
        const parsed = JSON.parse(data.nearby_cities);
        nearbyCities = Array.isArray(parsed) ? parsed : [];
      }
    }
  } catch (e) {
    console.error("Error parsing nearby_cities:", e);
  }
  
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
    shortDescription: data.shortDescription || '',
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
    propertyType: data.propertyType || '',
    generalInfo
  };
};
