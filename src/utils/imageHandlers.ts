
import { PropertyImage } from '@/types/property';
import { getImageUrl, normalizeImage } from './imageHelpers';

/**
 * Safe function to get the URL from any image type
 */
export function safelyGetImageUrl(image: string | PropertyImage | { url: string } | null | undefined): string | null {
  if (!image) return null;
  return getImageUrl(image);
}

/**
 * Function to ensure image collections are of a consistent type
 */
export function normalizeImageCollection(
  images: (string | PropertyImage | { url: string })[] | null | undefined
): PropertyImage[] {
  if (!images || !Array.isArray(images)) return [];
  return images.map(img => normalizeImage(img));
}

/**
 * Function to handle image URL extraction from various formats
 */
export function extractImageUrls(images: (string | PropertyImage | { url: string })[] | null | undefined): string[] {
  if (!images || !Array.isArray(images)) return [];
  return images.map(img => safelyGetImageUrl(img)).filter((url): url is string => url !== null);
}

/**
 * Function to safely get an image's ID
 */
export function safelyGetImageId(image: string | PropertyImage | { url: string; id?: string } | null | undefined): string | null {
  if (!image) return null;
  if (typeof image === 'string') return null;
  return (image as PropertyImage).id || null;
}
