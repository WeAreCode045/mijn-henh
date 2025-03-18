
import { PropertyData, PropertyImage, PropertyFloorplan, PropertyFeature, PropertyPlaceType, PropertyCity, PropertyGeneralInfo } from "@/types/property";
import { toPropertyImage, toPropertyFloorplan, getImageUrl } from "./imageTypeConverters";

// Define a more specific function name for local use to avoid the naming conflict
function getImageUrls(images: (string | PropertyImage)[] | undefined): string[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => typeof img === 'string' ? img : img.url);
}

/**
 * Converts any image array (string[] or mixed) to PropertyImage[]
 */
export function convertToPropertyImageArray(images: any[] | undefined): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return toPropertyImage(img);
    }
    return img as PropertyImage;
  });
}

/**
 * Converts any floorplan array (string[] or mixed) to PropertyFloorplan[]
 */
export function convertToPropertyFloorplanArray(floorplans: any[] | undefined): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) return [];
  
  return floorplans.map(fp => {
    if (typeof fp === 'string') {
      return toPropertyFloorplan(fp);
    }
    return fp as PropertyFloorplan;
  });
}

/**
 * Extracts image URLs as string array
 */
export function extractImageUrls(images: (string | PropertyImage)[] | undefined): string[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => typeof img === 'string' ? img : img.url);
}

/**
 * Adapts raw data from API to PropertyData
 */
export function convertApiDataToPropertyData(apiData: any): PropertyData {
  // Start with the original data
  const adaptedData = { ...apiData } as PropertyData;
  
  // Convert image arrays
  if (apiData.images) {
    adaptedData.images = convertToPropertyImageArray(apiData.images);
  }
  
  if (apiData.featuredImages) {
    adaptedData.featuredImages = convertToPropertyImageArray(apiData.featuredImages);
  }
  
  if (apiData.coverImages) {
    adaptedData.coverImages = convertToPropertyImageArray(apiData.coverImages);
  }
  
  if (apiData.gridImages) {
    adaptedData.gridImages = convertToPropertyImageArray(apiData.gridImages);
  }
  
  // Convert floorplans
  if (apiData.floorplans) {
    adaptedData.floorplans = convertToPropertyFloorplanArray(apiData.floorplans);
  }
  
  return adaptedData;
}

/**
 * Converts PropertyData to DTO for submission
 */
export function convertPropertyDataToDto(propertyData: PropertyData): any {
  const dto = { ...propertyData };
  
  // Create a result object that will include all the properties including custom JSON fields
  const result: any = { ...dto };
  
  // Parse features to string if needed
  if (Array.isArray(dto.features) && dto.features.length > 0) {
    result.featuresJson = JSON.stringify(dto.features);
  }
  
  // Parse nearby_places to string if needed
  if (Array.isArray(dto.nearby_places) && dto.nearby_places.length > 0) {
    result.nearby_placesJson = JSON.stringify(dto.nearby_places);
  }
  
  // Parse nearby_cities to string if needed
  if (Array.isArray(dto.nearby_cities) && dto.nearby_cities.length > 0) {
    result.nearby_citiesJson = JSON.stringify(dto.nearby_cities);
  }
  
  // Parse generalInfo to string if needed
  if (dto.generalInfo) {
    result.generalInfoJson = JSON.stringify(dto.generalInfo);
  }
  
  // Add URL string arrays for database compatibility
  if (dto.images && Array.isArray(dto.images)) {
    result.imagesUrls = extractImageUrls(dto.images);
  }
  
  if (dto.featuredImages && Array.isArray(dto.featuredImages)) {
    result.featuredImagesUrls = extractImageUrls(dto.featuredImages);
  }
  
  if (dto.coverImages && Array.isArray(dto.coverImages)) {
    result.coverImagesUrls = extractImageUrls(dto.coverImages);
  }
  
  if (dto.gridImages && Array.isArray(dto.gridImages)) {
    result.gridImagesUrls = extractImageUrls(dto.gridImages);
  }
  
  return result;
}
