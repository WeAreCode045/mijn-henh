
import { GeneralInfoData } from "@/types/property";

/**
 * Creates a default GeneralInfoData object with empty sections
 */
export function createDefaultGeneralInfo(): GeneralInfoData {
  return {
    propertyDetails: {},
    description: {},
    keyInformation: {}
  };
}

/**
 * Safely parses GeneralInfoData from potentially stringified data
 */
export function parseGeneralInfo(data: string | GeneralInfoData | undefined | null): GeneralInfoData {
  if (!data) {
    return createDefaultGeneralInfo();
  }
  
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as GeneralInfoData;
    } catch (e) {
      console.error('Failed to parse generalInfo:', e);
      return createDefaultGeneralInfo();
    }
  }
  
  return data;
}
