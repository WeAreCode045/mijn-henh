
import { PropertyImage } from "@/types/property";

/**
 * Normalizes an image value to a PropertyImage object
 * @param image Can be a string URL or PropertyImage object
 */
export function normalizeImage(image: string | { url: string } | PropertyImage): PropertyImage {
  if (typeof image === 'string') {
    return { id: crypto.randomUUID(), url: image };
  }
  if ('url' in image) {
    return { 
      id: (image as PropertyImage).id || crypto.randomUUID(), 
      url: image.url,
      ...(image as PropertyImage)
    };
  }
  return image as PropertyImage;
}

/**
 * Gets URL from various image formats
 */
export function getImageUrl(image: string | { url: string } | PropertyImage): string {
  if (typeof image === 'string') {
    return image;
  }
  return image.url;
}

/**
 * Normalizes an array of images to PropertyImage objects
 */
export function normalizeImages(images: (string | { url: string } | PropertyImage)[]): PropertyImage[] {
  if (!images) return [];
  return images.map(normalizeImage);
}

/**
 * Gets all image URLs from an array of images
 */
export function getImageUrls(images: (string | { url: string } | PropertyImage)[]): string[] {
  if (!images) return [];
  return images.map(getImageUrl);
}

/**
 * Gets the ID from an image
 */
export function getImageId(image: string | { url: string; id?: string } | PropertyImage): string {
  if (typeof image === 'string') {
    return crypto.randomUUID(); // Generate an ID if it's just a string URL
  }
  if ('id' in image && image.id) {
    return image.id;
  }
  return crypto.randomUUID();
}

/**
 * Validates if an item is a PropertyImage
 */
export function isPropertyImage(item: any): item is PropertyImage {
  return item && typeof item === 'object' && 'url' in item;
}
