
import { PropertyImage } from "@/types/property";

/**
 * Gets the URL from a string or PropertyImage object
 */
export function getImageUrl(image: string | PropertyImage): string {
  if (typeof image === 'string') {
    return image;
  }
  return image.url;
}
