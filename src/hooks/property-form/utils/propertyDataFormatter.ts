
import { PropertySubmitData } from "@/types/property";

/**
 * Prepares and formats JSON fields for database submission
 */
const formatPropertyJsonFields = (data: Partial<PropertySubmitData>) => {
  // Format features JSON
  const featuresJson = typeof data.features === 'string' 
    ? data.features 
    : JSON.stringify(data.features);

  // Format nearby_places JSON
  const nearby_placesJson = typeof data.nearby_places === 'string'
    ? data.nearby_places
    : JSON.stringify(data.nearby_places);

  // Format nearby_cities JSON
  const nearby_citiesJson = typeof data.nearby_cities === 'string'
    ? data.nearby_cities
    : JSON.stringify(data.nearby_cities);

  return {
    featuresJson,
    nearby_placesJson,
    nearby_citiesJson
  };
};

/**
 * Creates or updates metadata object with status
 */
const prepareMetadata = (data: Partial<PropertySubmitData>) => {
  // Create or update metadata if status exists
  const metadata = data.metadata || {};
  if (data.status) {
    metadata.status = data.status;
  }
  
  return metadata;
};

/**
 * Removes fields that don't exist in the database to prepare data for submission
 */
const cleanupPropertyData = (data: Partial<PropertySubmitData>) => {
  // Make a copy of data without fields that don't exist in the database
  const { 
    featuredImage, 
    featuredImages, 
    coverImages, 
    floorplans, 
    images, // Remove the images field that doesn't exist in properties table
    ...dataToSubmit 
  } = data as any;
  
  return dataToSubmit;
};

/**
 * Removes timestamp fields to let Supabase handle them automatically
 */
const removeTimestampFields = (data: Record<string, any>) => {
  const result = { ...data };
  
  // Remove created_at and updated_at to let Supabase handle them automatically
  if (result.created_at) {
    delete result.created_at;
  }
  if (result.updated_at) {
    delete result.updated_at;
  }
  
  return result;
};

/**
 * Prepares final property data for database submission
 */
export const preparePropertyDataForSubmission = (data: Partial<PropertySubmitData>) => {
  const cleanedData = cleanupPropertyData(data);
  const metadata = prepareMetadata(data);
  const { featuresJson, nearby_placesJson, nearby_citiesJson } = formatPropertyJsonFields(data);
  
  // Create the final data object with properly formatted fields
  const finalData = {
    ...cleanedData,
    features: featuresJson,
    nearby_places: nearby_placesJson,
    nearby_cities: nearby_citiesJson,
    metadata
  };
  
  // Remove timestamp fields to let Supabase handle them
  return removeTimestampFields(finalData);
};
