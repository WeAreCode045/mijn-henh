
import { PropertyData } from "@/types/property";

export const usePageCalculation = () => {
  const calculateTotalPages = (propertyData: PropertyData | null, isPrintView: boolean = false) => {
    if (!propertyData) return 0;
    
    let total = 2; // Overview and Details pages
    
    // Add area pages
    if (propertyData.areas && propertyData.areas.length > 0) {
      total += Math.ceil(propertyData.areas.length / 2);
    }
    
    // Add floorplans page if there are floorplans
    if (propertyData.floorplans && propertyData.floorplans.length > 0) {
      total += 1;
    }
    
    // Add neighborhood page
    total += 1;
    
    // Add contact page if not print view
    if (!isPrintView) {
      total += 1;
    }
    
    return total;
  };

  return { calculateTotalPages };
};
