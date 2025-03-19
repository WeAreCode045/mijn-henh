
import { GeneralInfoData } from "@/types/property";

/**
 * Helper function to safely convert generalInfo
 */
export const formatGeneralInfo = (data: any): GeneralInfoData | undefined => {
  if (!data) return undefined;
  
  // If it's already an object with the right shape, return it
  if (typeof data === 'object' && !Array.isArray(data)) {
    // Check if it has at least one expected property
    if ('propertyDetails' in data || 'description' in data || 'keyInformation' in data) {
      return data as GeneralInfoData;
    }
  }
  
  // If it's a string, try to parse it to an object
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as GeneralInfoData;
      }
    } catch (e) {
      // Failed to parse, return undefined
      return undefined;
    }
  }
  
  // Return undefined if we couldn't convert to GeneralInfoData
  return undefined;
};

/**
 * Creates a default GeneralInfo object from property data
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
      shortDescription: propertyData.description || '',
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
    }
  };
};
