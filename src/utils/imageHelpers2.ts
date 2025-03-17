
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Safely handle accessing URL from any image type (string or object)
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return "";
  
  if (typeof image === "string") {
    return image;
  }
  
  return image.url || "";
}

/**
 * Convert array of mixed image types to PropertyImage[] 
 */
export function convertToPropertyImages(images: (string | PropertyImage | PropertyFloorplan)[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: img,
        type: "image"
      };
    }
    
    // Handle PropertyFloorplan conversion to PropertyImage
    if ((img as PropertyFloorplan).type === 'floorplan') {
      return {
        id: img.id,
        url: img.url,
        title: (img as PropertyFloorplan).title || undefined,
        description: (img as PropertyFloorplan).description || undefined,
        type: "floorplan",
        sort_order: (img as PropertyFloorplan).sort_order,
        filePath: (img as PropertyFloorplan).filePath
      };
    }
    
    // Already a PropertyImage
    return img as PropertyImage;
  });
}

/**
 * Get main image from array
 */
export function getMainImage(images: (string | PropertyImage)[]): PropertyImage | null {
  if (!images || !Array.isArray(images) || images.length === 0) return null;
  
  const propertyImages = images.map(img => typeof img === 'string' ? { id: '', url: img } : img);
  return propertyImages.find(img => img.is_main) || propertyImages[0];
}

/**
 * Get featured images from array
 */
export function getFeaturedImages(images: (string | PropertyImage)[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  const propertyImages = images.map(img => typeof img === 'string' ? { id: '', url: img } : img);
  return propertyImages.filter(img => img.is_featured_image === true);
}

/**
 * Safe image URL resolver for components
 */
export function resolveImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  return typeof image === 'string' ? image : image.url || '';
}
