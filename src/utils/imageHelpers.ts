
import { PropertyImage } from "@/types/property";

/**
 * Helper function to safely get URL from either string or object with URL property
 */
export function getImageUrl(image: string | { url: string } | PropertyImage): string {
  if (typeof image === 'string') {
    return image;
  }
  
  if (image && typeof image === 'object' && 'url' in image) {
    return image.url;
  }
  
  return '';
}

/**
 * Helper function to normalize images to PropertyImage type
 */
export function normalizeImage(image: string | { url: string } | PropertyImage): PropertyImage {
  if (typeof image === 'string') {
    return { id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, url: image };
  }
  
  if ('url' in image) {
    return {
      id: ('id' in image) ? image.id : `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: image.url,
      ...('property_id' in image ? { property_id: image.property_id } : {}),
      ...('is_main' in image ? { is_main: image.is_main } : {}),
      ...('is_featured_image' in image ? { is_featured_image: image.is_featured_image } : {}),
      ...('area' in image ? { area: image.area } : {}),
      ...('sort_order' in image ? { sort_order: image.sort_order } : {})
    };
  }
  
  return image;
}

/**
 * Helper function to normalize an array of images
 */
export function normalizeImages(images: (string | { url: string } | PropertyImage)[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) {
    return [];
  }
  
  return images.map(img => normalizeImage(img));
}
