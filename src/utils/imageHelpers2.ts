
import { PropertyImage, PropertyFloorplan } from "@/types/property";
import { getImageUrl, normalizeImage } from "./imageHelpers";

/**
 * Safely handle accessing URL from any image type (string or object)
 */
export function safelyGetImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string | null {
  if (!image) return null;
  
  if (typeof image === "string") {
    return image;
  }
  
  return image.url || "";
}

/**
 * Function to ensure image collections are of a consistent type
 */
export function convertToPropertyImages(images: (string | PropertyImage | PropertyFloorplan)[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img,
        type: "image"
      };
    }
    
    // Handle PropertyFloorplan conversion to PropertyImage
    if ((img as any).type === 'floorplan') {
      return {
        id: img.id,
        url: img.url,
        title: (img as any).title || undefined,
        description: (img as any).description || undefined,
        type: "floorplan",
        sort_order: (img as any).sort_order,
        filePath: (img as any).filePath
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
  
  const propertyImages = images.map(img => typeof img === 'string' ? { id: '', url: img, type: "image" as const } : img);
  const mainImage = propertyImages.find(img => (img as any).is_main);
  return mainImage || propertyImages[0];
}

/**
 * Get featured images from array
 */
export function getFeaturedImages(images: (string | PropertyImage)[]): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  const propertyImages = images.map(img => typeof img === 'string' ? { id: '', url: img, type: "image" as const } : img);
  return propertyImages.filter(img => (img as any).is_featured_image === true);
}

/**
 * Safe image URL resolver for components
 */
export function resolveImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  return typeof image === 'string' ? image : image.url || '';
}
