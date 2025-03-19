
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Converts an array of database image objects to PropertyImage[] type
 */
export function convertToPropertyImageArray(images: any[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => ({
    id: img.id || `img-${Math.random().toString(36).substr(2, 9)}`,
    url: img.url || '',
    type: (img.type === 'floorplan' ? 'floorplan' : 'image') as 'image' | 'floorplan',
    is_main: img.is_main || false,
    is_featured_image: img.is_featured_image || false,
    sort_order: img.sort_order || 0,
    property_id: img.property_id || null,
    area: img.area || null,
    alt: img.title || '',
    title: img.title || '',
    description: img.description || ''
  }));
}

/**
 * Converts an array of database floorplan objects to PropertyFloorplan[] type
 */
export function convertToPropertyFloorplanArray(floorplans: any[]): PropertyFloorplan[] {
  if (!floorplans || !Array.isArray(floorplans)) return [];
  
  return floorplans.map(fp => ({
    id: fp.id || `fp-${Math.random().toString(36).substr(2, 9)}`,
    url: fp.url || '',
    title: fp.title || '',
    description: fp.description || '',
    sort_order: fp.sort_order || 0,
    property_id: fp.property_id || null,
    type: 'floorplan',
    alt: fp.title || ''
  }));
}

/**
 * Extracts the image URL from various image object formats
 */
export function getImageUrl(image: any): string {
  if (!image) return '';
  
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object') {
    return image.url || image.src || '';
  }
  
  return '';
}
