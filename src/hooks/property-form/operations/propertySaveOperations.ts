
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/property';
import { extractPropertyId, isPropertyIdEmpty } from '../utils/dataTransformationUtils';
import { jsonToString, asJsonArray, Json } from '@/utils/supabaseTypes';

/**
 * Prepares property data for saving to Supabase
 */
export const preparePropertyDataForSave = (formData: PropertyFormData) => {
  // Convert arrays to JSON strings for database storage
  return {
    title: formData.title,
    price: formData.price,
    address: formData.address,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    sqft: formData.sqft,
    livingArea: formData.livingArea,
    buildYear: formData.buildYear,
    garages: formData.garages,
    energyLabel: formData.energyLabel,
    hasGarden: formData.hasGarden,
    description: formData.description,
    shortDescription: formData.shortDescription,
    location_description: formData.location_description,
    features: JSON.stringify(formData.features || []),
    areas: JSON.stringify(formData.areas || []),
    nearby_places: JSON.stringify(formData.nearby_places || []),
    nearby_cities: JSON.stringify(formData.nearby_cities || []),
    latitude: formData.latitude,
    longitude: formData.longitude,
    object_id: formData.object_id,
    agent_id: formData.agent_id,
    template_id: formData.template_id,
    floorplanEmbedScript: formData.floorplanEmbedScript,
    virtualTourUrl: formData.virtualTourUrl,
    youtubeUrl: formData.youtubeUrl,
    notes: formData.notes,
    property_type: formData.propertyType, // Use property_type field name to match database
    generalInfo: formData.generalInfo ? JSON.stringify(formData.generalInfo) : null
  };
};

/**
 * Saves property data to Supabase
 */
export const savePropertyDataToApi = async (propertyId: string | any, formData: PropertyFormData) => {
  // Ensure propertyId is a string
  const id = extractPropertyId(propertyId);
  
  // Validate ID before attempting to save
  if (isPropertyIdEmpty(id)) {
    console.error('Invalid property ID for saving:', propertyId);
    throw new Error('Invalid property ID');
  }
  
  const preparedData = preparePropertyDataForSave(formData);
  
  const { error } = await supabase
    .from('properties')
    .update(preparedData)
    .eq('id', id);
  
  if (error) {
    throw error;
  }
  
  return true;
};
