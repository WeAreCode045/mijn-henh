
import { PropertyImage, PropertyFloorplan } from "@/types/property";

/**
 * Helper function to get an image URL regardless of input type
 */
export function getImageUrl(
  image: string | PropertyImage | PropertyFloorplan | null | undefined
): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}
