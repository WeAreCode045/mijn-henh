
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Converts a string or mixed image to PropertyImage
 */
export function toPropertyImage(image: string | any): PropertyImage {
  if (typeof image === 'string') {
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: image,
      type: "image"
    };
  }
  
  // Ensure we have all the required fields
  return {
    id: image.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: image.url || '',
    type: image.type === 'floorplan' ? 'floorplan' : 'image',
    is_main: image.is_main,
    is_featured_image: image.is_featured_image,
    sort_order: image.sort_order,
    title: image.title,
    description: image.description,
    alt: image.alt,
    property_id: image.property_id,
    area: image.area,
    filePath: image.filePath
  };
}

/**
 * Converts a mixed array to PropertyImage[]
 */
export function toPropertyImageArray(images: (string | PropertyImage | any)[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  return images.map(img => toPropertyImage(img));
}

/**
 * Converts a string or mixed floorplan to PropertyFloorplan
 */
export function toPropertyFloorplan(floorplan: string | any): PropertyFloorplan {
  if (typeof floorplan === 'string') {
    return {
      id: `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: floorplan,
      type: "floorplan"
    };
  }
  
  // Ensure we have all the required fields
  return {
    id: floorplan.id || `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: floorplan.url || '',
    type: "floorplan",
    title: floorplan.title,
    description: floorplan.description,
    alt: floorplan.alt,
    property_id: floorplan.property_id,
    sort_order: floorplan.sort_order,
    filePath: floorplan.filePath,
    columns: floorplan.columns
  };
}

/**
 * Converts a mixed array to PropertyFloorplan[]
 */
export function toPropertyFloorplanArray(floorplans: (string | PropertyFloorplan | any)[]): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) return [];
  return floorplans.map(fp => toPropertyFloorplan(fp));
}

/**
 * Gets a URL from any image type
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
}
