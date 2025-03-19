
import { GeneralInfoData } from "@/types/property";

/**
 * Format general info data from various sources
 */
export const formatGeneralInfo = (data: any): GeneralInfoData | undefined => {
  if (!data) return undefined;
  
  // If it's already an object, use it directly
  if (typeof data === 'object' && !Array.isArray(data)) {
    return data as GeneralInfoData;
  }
  
  // Try to parse it if it's a string
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as GeneralInfoData;
      }
    } catch (e) {
      console.error("Error parsing generalInfo:", e);
      return undefined;
    }
  }
  
  return undefined;
};

/**
 * Create default general info from property data
 */
export const createDefaultGeneralInfo = (propertyData: any): GeneralInfoData => {
  return {
    propertyDetails: {
      title: propertyData.title || '',
      price: propertyData.price || '',
      address: propertyData.address || '',
      objectId: propertyData.object_id || '',
    },
    description: {
      shortDescription: propertyData.shortDescription || propertyData.description || '',
      fullDescription: propertyData.description || '',
    },
    keyInformation: {
      buildYear: propertyData.buildYear || '',
      lotSize: propertyData.sqft || '',
      livingArea: propertyData.livingArea || '',
      bedrooms: propertyData.bedrooms || '',
      bathrooms: propertyData.bathrooms || '',
      energyClass: propertyData.energyLabel || '',
      garages: propertyData.garages || '',
      hasGarden: propertyData.hasGarden || false,
    },
  };
};
