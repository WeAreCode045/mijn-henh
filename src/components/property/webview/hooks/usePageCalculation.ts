
import { PropertyData } from "@/types/property";

export const usePageCalculation = () => {
  const calculateTotalPages = (propertyData: PropertyData | null, isPrintView: boolean = false) => {
    if (!propertyData) return 0;
    
    // Start with basic pages
    let total = 2; // Overview and Details pages always exist
    
    // Add area pages if they exist
    if (propertyData.areas && propertyData.areas.length > 0) {
      total += 1; // Add area page
    }
    
    // Add neighborhood page
    total += 1;
    
    // Add contact page if not print view
    if (!isPrintView) {
      total += 1;
    }
    
    return total;
  };

  // A function to validate if a page index is valid
  const isValidPageIndex = (pageIndex: number, propertyData: PropertyData | null, isPrintView: boolean = false) => {
    if (!propertyData) return false;
    const totalPages = calculateTotalPages(propertyData, isPrintView);
    return pageIndex >= 0 && pageIndex < totalPages;
  };

  return { calculateTotalPages, isValidPageIndex };
};
