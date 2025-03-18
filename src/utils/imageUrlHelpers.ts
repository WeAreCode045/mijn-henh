import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Safely get a URL from any image type (string or object)
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
}

/**
 * Get a property value from an image object with fallback
 */
export function getImageProperty<T>(
  image: string | PropertyImage | PropertyFloorplan | null | undefined, 
  property: string, 
  fallback: T
): T {
  if (!image || typeof image === 'string') return fallback;
  return (image as any)[property] || fallback;
}

/**
 * Extract URLs from an array of images
 */
export function getImageUrls(images: (string | PropertyImage | PropertyFloorplan)[]): string[] {
  if (!Array.isArray(images)) return [];
  return images.map(img => getImageUrl(img));
}

/**
 * Check if an image is the main image
 */
export function isMainImage(image: PropertyImage | null): boolean {
  if (!image) return false;
  return !!(image.is_main);
}

/**
 * Check if an image is a featured image
 */
export function isFeaturedImage(image: PropertyImage | null): boolean {
  if (!image) return false;
  return !!(image.is_featured_image);
}

/**
 * Get the URL for a property's featured image or first image
 */
export function getPropertyMainImageUrl(property: any): string {
  if (!property) return '';
  
  // If there's a dedicated featured image field
  if (property.featuredImage) return property.featuredImage;
  
  // Try to find an image marked as main in the images array
  if (Array.isArray(property.images) && property.images.length > 0) {
    // First look for an image explicitly marked as main
    const mainImage = property.images.find((img: any) => 
      typeof img !== 'string' && img.is_main
    );
    
    if (mainImage) return getImageUrl(mainImage);
    
    // Otherwise use the first image
    return getImageUrl(property.images[0]);
  }
  
  return '';
}
