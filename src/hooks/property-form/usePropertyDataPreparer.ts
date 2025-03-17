
import { PropertyFormData, PropertyFeature, PropertyPlaceType, PropertyCity, GeneralInfoData } from "@/types/property";
import { transformFeatures, transformNearbyPlaces, transformGeneralInfo } from "./propertyDataTransformer";

// Function to safely parse JSON
const safeJsonParse = <T,>(jsonString: string | undefined | null, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return defaultValue;
  }
};

export function usePropertyDataPreparer() {
  // Prepare data for form submission
  const preparePropertyData = (formData: PropertyFormData) => {
    // Convert complex objects to JSON strings
    const data = {
      ...formData,
      features: Array.isArray(formData.features) ? JSON.stringify(formData.features) : JSON.stringify([]),
      areas: Array.isArray(formData.areas) ? JSON.stringify(formData.areas) : JSON.stringify([]),
      nearby_places: Array.isArray(formData.nearby_places) ? JSON.stringify(formData.nearby_places) : JSON.stringify([]),
      nearby_cities: Array.isArray(formData.nearby_cities) ? JSON.stringify(formData.nearby_cities) : JSON.stringify([]),
      generalInfo: formData.generalInfo ? JSON.stringify(formData.generalInfo) : null
    };
    
    return data;
  };
  
  // Process data from API to use in forms
  const processPropertyData = (data: any) => {
    if (!data) return null;
    
    // Parse JSON strings
    const features: PropertyFeature[] = safeJsonParse(data.features, []);
    const areas = safeJsonParse(data.areas, []);
    const nearby_places: PropertyPlaceType[] = safeJsonParse(data.nearby_places, []);
    const nearby_cities: PropertyCity[] = safeJsonParse(data.nearby_cities, []);
    const generalInfo: GeneralInfoData | undefined = transformGeneralInfo(data.generalInfo);
    
    // Prepare processed data
    const processedData: PropertyFormData = {
      ...data,
      features,
      areas,
      nearby_places,
      nearby_cities,
      generalInfo,
      // Ensure primitive types
      hasGarden: !!data.hasGarden,
      latitude: data.latitude !== undefined ? data.latitude : null,
      longitude: data.longitude !== undefined ? data.longitude : null
    };
    
    return processedData;
  };
  
  return {
    preparePropertyData,
    processPropertyData
  };
}
