import { PropertyImage, PropertyFloorplan, PropertyFormData } from "@/types/property";

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
        type: "floorplan" as const
      };
    }
    
    // Make sure all required fields are present
    return {
      id: fp.id || `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: fp.url || '',
      type: "floorplan" as const,
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
  const normalized: PropertyFormData = {
    ...formData,
    images: convertToPropertyImageArray(formData.images || []).map(img => ({ ...img, type: img.type || "image" as const })),
    floorplans: convertToPropertyFloorplanArray(formData.floorplans || []).map(fp => ({ ...fp, type: "floorplan" as const })),
    coverImages: convertToPropertyImageArray(formData.coverImages || []).map(img => ({ ...img, type: img.type || "image" as const })),
    gridImages: convertToPropertyImageArray(formData.gridImages || []).map(img => ({ ...img, type: img.type || "image" as const })),
  };
  
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
