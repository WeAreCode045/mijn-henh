
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Converts various image data formats to a PropertyImage object
 */
export function toPropertyImage(image: any): PropertyImage {
  if (typeof image === 'string') {
    return {
      id: crypto.randomUUID(),
      url: image,
      type: 'image'
    };
  } else if (typeof image === 'object' && image !== null) {
    return {
      id: image.id || crypto.randomUUID(),
      url: image.url || '',
      type: image.type || 'image',
      is_main: image.is_main || false,
      is_featured_image: image.is_featured_image || false,
      sort_order: image.sort_order || 0,
      property_id: image.property_id || null,
      area: image.area || null,
      alt: image.alt || image.title || '',
      title: image.title || '',
      description: image.description || ''
    };
  }
  
  return {
    id: crypto.randomUUID(),
    url: '',
    type: 'image'
  };
}

/**
 * Converts various floorplan data formats to a PropertyFloorplan object
 */
export function toPropertyFloorplan(floorplan: any): PropertyFloorplan {
  if (typeof floorplan === 'string') {
    return {
      id: crypto.randomUUID(),
      url: floorplan,
      type: 'floorplan',
      title: '',
      description: '',
      sort_order: 0
    };
  } else if (typeof floorplan === 'object' && floorplan !== null) {
    return {
      id: floorplan.id || crypto.randomUUID(),
      url: floorplan.url || '',
      type: 'floorplan',
      title: floorplan.title || '',
      description: floorplan.description || '',
      sort_order: floorplan.sort_order || 0,
      property_id: floorplan.property_id || null,
      alt: floorplan.alt || floorplan.title || ''
    };
  }
  
  return {
    id: crypto.randomUUID(),
    url: '',
    type: 'floorplan',
    title: '',
    description: '',
    sort_order: 0
  };
}

/**
 * Converts an array of image data to an array of PropertyImage objects
 */
export function toPropertyImageArray(images: any[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  return images.map(toPropertyImage);
}

/**
 * Converts an array of floorplan data to an array of PropertyFloorplan objects
 */
export function toPropertyFloorplanArray(floorplans: any[]): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) return [];
  return floorplans.map(toPropertyFloorplan);
}

/**
 * Gets the URL from a PropertyImage or a string
 */
export function getImageUrl(image: PropertyImage | string): string {
  if (typeof image === 'string') {
    return image;
  }
  return image.url || '';
}

/**
 * Converts any image type to a PropertyImage array
 */
export function convertToPropertyImageArray(images: any[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: crypto.randomUUID(),
        url: img,
        type: 'image'
      };
    } else if (typeof img === 'object' && img !== null) {
      return {
        id: img.id || crypto.randomUUID(),
        url: img.url || '',
        type: img.type || 'image',
        is_main: img.is_main || false,
        is_featured_image: img.is_featured_image || false,
        sort_order: img.sort_order || 0,
        property_id: img.property_id || null,
        area: img.area || null,
        alt: img.alt || img.title || '',
        title: img.title || '',
        description: img.description || ''
      };
    }
    return {
      id: crypto.randomUUID(),
      url: '',
      type: 'image'
    };
  });
}

/**
 * Converts any floorplan type to a PropertyFloorplan array
 */
export function convertToFloorplanArray(floorplans: any[]): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) return [];
  
  return floorplans.map(fp => {
    if (typeof fp === 'string') {
      return {
        id: crypto.randomUUID(),
        url: fp,
        type: 'floorplan',
        title: '',
        description: '',
        sort_order: 0
      };
    } else if (typeof fp === 'object' && fp !== null) {
      return {
        id: fp.id || crypto.randomUUID(),
        url: fp.url || '',
        type: 'floorplan',
        title: fp.title || '',
        description: fp.description || '',
        sort_order: fp.sort_order || 0,
        property_id: fp.property_id || null,
        alt: fp.alt || fp.title || ''
      };
    }
    return {
      id: crypto.randomUUID(),
      url: '',
      type: 'floorplan',
      title: '',
      description: '',
      sort_order: 0
    };
  });
}
