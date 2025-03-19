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
 * Creates a new PropertyImage object from a URL string
 */
export function toPropertyImage(url: string, isMain: boolean = false): PropertyImage {
  return {
    id: `img-${Math.random().toString(36).substr(2, 9)}`,
    url: url,
    type: 'image',
    is_main: isMain,
    is_featured_image: false,
    sort_order: 0,
    property_id: null,
    area: null
  };
}

/**
 * Creates a new PropertyFloorplan object from a URL string
 */
export function toPropertyFloorplan(url: string): PropertyFloorplan {
  return {
    id: `fp-${Math.random().toString(36).substr(2, 9)}`,
    url: url,
    title: '',
    description: '',
    sort_order: 0,
    property_id: null,
    type: 'floorplan',
    alt: ''
  };
}

/**
 * Converts an array of URL strings to PropertyFloorplan[] type
 */
export function toPropertyFloorplanArray(urls: string[] | PropertyFloorplan[]): PropertyFloorplan[] {
  if (!urls || !Array.isArray(urls)) return [];
  
  // If the array already contains PropertyFloorplan objects, return it
  if (urls.length > 0 && typeof urls[0] === 'object') {
    return urls as PropertyFloorplan[];
  }
  
  // Otherwise, convert URL strings to PropertyFloorplan objects
  return (urls as string[]).map(url => toPropertyFloorplan(url));
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
