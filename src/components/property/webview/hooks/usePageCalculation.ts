
import { PropertyData } from "@/types/property";

export const usePageCalculation = () => {
  const calculateTotalPages = (propertyData: PropertyData | null, isPrintView: boolean = false) => {
    if (!propertyData) return 0;
    
    // Start with basic pages
    let total = 2; // Overview and Details pages always exist
    
    // Add individual area pages if they exist
    if (propertyData.areas && propertyData.areas.length > 0) {
      total += propertyData.areas.length; // Add a page for each area
    }
    
    // Add floorplan page if floorplanEmbedScript exists or floorplans array has items
    if ((propertyData.floorplanEmbedScript && propertyData.floorplanEmbedScript.trim() !== '') ||
        (propertyData.floorplans && propertyData.floorplans.length > 0)) {
      total += 1;
    }
    
    // Add neighborhood page
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

  // Function to get section index based on page number
  const getSectionIndex = (pageIndex: number, propertyData: PropertyData | null, isPrintView: boolean = false) => {
    if (!isValidPageIndex(pageIndex, propertyData, isPrintView)) {
      return 0; // Default to first page if invalid
    }
    
    return pageIndex;
  };

  return { calculateTotalPages, isValidPageIndex, getSectionIndex };
};
