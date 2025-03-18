
import { PropertyImage, PropertyFloorplan, PropertyFormData } from "@/types/property";
import { toFloorplan, toFloorplanArray } from "./floorplanHelpers";
import { normalizeImage, toPropertyImageArray } from "./imageHelpers";

/**
 * Convert mixed image types to PropertyImage[]
 */
export function convertToPropertyImageArray(images: any[]): PropertyImage[] {
  if (!Array.isArray(images)) {
    return [];
  }
  
  return images.map((img): PropertyImage => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: img,
        type: "image"
      };
    }
    
    // Make sure all required fields are present
    return {
      id: img.id || `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: img.url || '',
      type: img.type === 'floorplan' ? 'floorplan' : 'image',
      alt: img.alt,
      title: img.title,
      description: img.description,
      is_main: img.is_main,
      is_featured_image: img.is_featured_image,
      sort_order: img.sort_order,
      property_id: img.property_id,
      area: img.area,
      filePath: img.filePath
    };
  });
}

/**
 * Convert mixed floorplan types to PropertyFloorplan[]
 */
export function convertToPropertyFloorplanArray(floorplans: any[]): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) {
    return [];
  }
  
  return floorplans.map((fp): PropertyFloorplan => {
    if (typeof fp === 'string') {
      return {
        id: `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: fp,
        type: "floorplan"
      };
    }
    
    // Make sure all required fields are present
    return {
      id: fp.id || `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: fp.url || '',
      type: "floorplan",
      title: fp.title,
      alt: fp.alt,
      description: fp.description,
      sort_order: fp.sort_order,
      property_id: fp.property_id,
      filePath: fp.filePath,
      columns: fp.columns
    };
  });
}

/**
 * Fix image types in PropertyFormData for saving
 */
export function normalizePropertyImageTypes(formData: PropertyFormData): PropertyFormData {
  // Create a deeply copied object to avoid modifying the original
  const normalized: PropertyFormData = {
    ...formData
  };
  
  // Convert image arrays to PropertyImage[] arrays
  if (formData.images) {
    normalized.images = convertToPropertyImageArray(formData.images as any[]);
  }
  
  if (formData.floorplans) {
    normalized.floorplans = convertToPropertyFloorplanArray(formData.floorplans as any[]);
  }
  
  if (formData.coverImages) {
    normalized.coverImages = convertToPropertyImageArray(formData.coverImages as any[]);
  }
  
  if (formData.gridImages) {
    normalized.gridImages = convertToPropertyImageArray(formData.gridImages as any[]);
  }
  
  return normalized;
}

/**
 * Helper to safely get an image URL from any image format
 */
export function getImageUrl(image: string | PropertyImage | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}
