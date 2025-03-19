
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Converts a database image record to a PropertyImage type
 */
export function toPropertyImage(dbImage: any): PropertyImage {
  return {
    id: dbImage.id,
    url: dbImage.url,
    type: (dbImage.type || 'image') as 'image' | 'floorplan',
    is_main: dbImage.is_main || false,
    is_featured_image: dbImage.is_featured_image || false,
    sort_order: dbImage.sort_order || 0,
    property_id: dbImage.property_id,
    area: dbImage.area || null,
    alt: dbImage.title || '',
    title: dbImage.title || '',
    description: dbImage.description || ''
  };
}

/**
 * Converts an array of database image records to PropertyImage type
 */
export function toPropertyImageArray(dbImages: any[]): PropertyImage[] {
  if (!dbImages || !Array.isArray(dbImages)) return [];
  return dbImages.map(toPropertyImage);
}

/**
 * Converts a database floorplan record to a PropertyFloorplan type
 */
export function toPropertyFloorplan(dbFloorplan: any): PropertyFloorplan {
  return {
    id: dbFloorplan.id,
    url: dbFloorplan.url,
    title: dbFloorplan.title || '',
    description: dbFloorplan.description || '',
    sort_order: dbFloorplan.sort_order || 0,
    property_id: dbFloorplan.property_id,
    type: 'floorplan',
    alt: dbFloorplan.title || '',
  };
}

/**
 * Converts an array of database floorplan records to PropertyFloorplan type
 */
export function toPropertyFloorplanArray(dbFloorplans: any[]): PropertyFloorplan[] {
  if (!dbFloorplans || !Array.isArray(dbFloorplans)) return [];
  return dbFloorplans.map(toPropertyFloorplan);
}

/**
 * Gets the URL from a PropertyImage object or returns the string if it's already a URL
 */
export function getImageUrl(image: PropertyImage | string): string {
  if (typeof image === 'string') return image;
  return image.url || '';
}

/**
 * Converts an array of mixed types to PropertyImage array
 */
export function convertToPropertyImageArray(images: (PropertyImage | string)[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random()}`,
        url: img,
        type: 'image'
      };
    }
    return img;
  });
}

/**
 * Converts an array of mixed types to PropertyFloorplan array
 */
export function convertToFloorplanArray(floorplans: (PropertyFloorplan | string)[]): PropertyFloorplan[] {
  if (!floorplans || !Array.isArray(floorplans)) return [];
  
  return floorplans.map(fp => {
    if (typeof fp === 'string') {
      return {
        id: `fp-${Date.now()}-${Math.random()}`,
        url: fp,
        type: 'floorplan'
      };
    }
    return fp;
  });
}
