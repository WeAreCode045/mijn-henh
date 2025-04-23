
import { PropertyData } from "@/types/property";

export const usePageCalculation = () => {
  const calculateTotalPages = (propertyData: PropertyData | null, isPrintView: boolean = false) => {
    if (!propertyData) return 0;
    
    // Count sections based on property structure
    let total = 2; // Start with Overview and Details pages which always exist
    
    // Add individual area pages if they exist
    if (propertyData.areas && propertyData.areas.length > 0) {
      total += propertyData.areas.length; // Add a page for each area
    }
    
    // Add floorplan page if available
    if ((propertyData.floorplanEmbedScript && propertyData.floorplanEmbedScript.trim() !== '') ||
        (propertyData.floorplans && propertyData.floorplans.length > 0)) {
      total += 1;
    }
    
    // Add neighborhood page (always present)
    total += 1;
    
    // Add virtual tour page if either virtualTourUrl or youtubeUrl exists
    if ((propertyData.virtualTourUrl && propertyData.virtualTourUrl.trim() !== '') ||
        (propertyData.youtubeUrl && propertyData.youtubeUrl.trim() !== '')) {
      total += 1;
    }
    
    // Add contact page if not print view
    if (!isPrintView) {
      total += 1;
    }
    
    console.log('Total pages calculated:', total, {
      hasAreas: propertyData.areas?.length > 0,
      areaCount: propertyData.areas?.length || 0,
      hasFloorplan: (!!propertyData.floorplanEmbedScript && propertyData.floorplanEmbedScript.trim() !== '') || 
                    (propertyData.floorplans && propertyData.floorplans.length > 0),
      hasVirtualTour: !!propertyData.virtualTourUrl || !!propertyData.youtubeUrl,
      isPrintView
    });
    
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
