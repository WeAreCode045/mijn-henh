
import { PropertyImage } from "@/types/property";

/**
 * Gets the URL from a PropertyImage or string
 * @param image - The image to get the URL from
 * @returns The URL of the image
 */
export function getImageUrl(image: PropertyImage | string | { url: string }): string {
  if (typeof image === 'string') {
    return image;
  }
  
  return image.url;
}

/**
 * Safely converts a variety of image types to a consistent PropertyImage[] array
 * @param images - The images to convert
 * @returns A PropertyImage[] array
 */
export function normalizeImages(images: any[] | undefined): PropertyImage[] {
  if (!images || !Array.isArray(images)) {
    return [];
  }
  
  return images.map(img => {
    if (typeof img === 'string') {
      return { id: crypto.randomUUID(), url: img };
    } else if (typeof img === 'object' && img !== null && 'url' in img) {
      return { 
        id: img.id || crypto.randomUUID(), 
        url: img.url,
        ...('area' in img ? { area: img.area } : {}),
        ...('is_main' in img ? { is_main: img.is_main } : {}),
        ...('is_featured_image' in img ? { is_featured_image: img.is_featured_image } : {}),
        ...('sort_order' in img ? { sort_order: img.sort_order } : {})
      };
    }
    
    // Fallback for unexpected types
    return { id: crypto.randomUUID(), url: String(img) };
  });
}
