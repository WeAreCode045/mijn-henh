
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Converts an array of PropertyImage objects to PropertyFloorplan[] type
 * Useful when the API returns all images with the same schema and we need to separate them
 */
export function convertToFloorplanArray(images: PropertyImage[]): PropertyFloorplan[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => ({
    id: img.id,
    url: img.url,
    title: img.title || '',
    description: img.description || '',
    sort_order: img.sort_order || 0,
    property_id: img.property_id || undefined,
    type: 'floorplan',
    alt: img.alt || ''
  }));
}

/**
 * Gets the image URL from various image object formats
 */
export function getImageUrl(image: any): string {
  if (!image) return '';
  
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object' && image !== null) {
    return image.url || image.src || '';
  }
  
  return '';
}
