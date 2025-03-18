
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Convert various image formats to a consistent PropertyImage array
 */
export function convertToPropertyImageArray(images: any[] | undefined): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img,
        type: "image"
      };
    } else {
      return {
        id: img.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img.url || '',
        type: img.type || 'image',
        is_main: img.is_main,
        is_featured_image: img.is_featured_image,
        sort_order: img.sort_order,
        title: img.title,
        description: img.description,
        alt: img.alt,
        property_id: img.property_id,
        area: img.area,
        filePath: img.filePath
      };
    }
  });
}

/**
 * Convert various floorplan formats to a consistent PropertyFloorplan array
 */
export function convertToPropertyFloorplanArray(floorplans: any[] | undefined): PropertyFloorplan[] {
  if (!floorplans || !Array.isArray(floorplans)) return [];
  
  return floorplans.map(fp => {
    if (typeof fp === 'string') {
      return {
        id: `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: fp,
        type: "floorplan",
        alt: ""
      };
    } else {
      return {
        id: fp.id || `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: fp.url || '',
        type: "floorplan",
        title: fp.title,
        description: fp.description,
        sort_order: fp.sort_order,
        property_id: fp.property_id,
        filePath: fp.filePath,
        columns: fp.columns,
        alt: fp.alt || ""
      };
    }
  });
}

/**
 * Extract image URLs from PropertyImage array
 */
export function extractImageUrls(images: PropertyImage[]): string[] {
  return images.map(img => img.url);
}

/**
 * Get image URL safely from different formats
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
}
