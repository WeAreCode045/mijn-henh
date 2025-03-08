
import { PropertyImage } from "@/types/property";

/**
 * Helper function to ensure an image object is processed correctly
 * Handles both string URLs and PropertyImage objects
 */
export function getImageUrl(image: string | PropertyImage): string {
  if (typeof image === 'string') {
    return image;
  }
  return image.url;
}

/**
 * Helper function to get image ID from either string or object
 * Returns undefined if the image doesn't have an ID
 */
export function getImageId(image: string | PropertyImage): string | undefined {
  if (typeof image === 'string') {
    return undefined;
  }
  return image.id;
}

/**
 * Helper function to convert image URLs to PropertyImage objects
 */
export function convertUrlsToImageObjects(urls: string[]): PropertyImage[] {
  return urls.map(url => ({
    id: crypto.randomUUID(),
    url
  }));
}

/**
 * Helper function to extract URLs from PropertyImage objects
 */
export function extractUrlsFromImages(images: PropertyImage[]): string[] {
  return images.map(image => image.url);
}
