
import { PropertyArea, PropertyImage } from "@/types/property";
import { normalizeImage } from "@/utils/imageHelpers";

/**
 * Helper functions for property area components
 */

/**
 * Gets an area's display title with fallback
 */
export function getAreaTitle(area: PropertyArea): string {
  return area.title || area.name || 'Unnamed Area';
}

/**
 * Normalizes an area's images to ensure they're all PropertyImage objects
 */
export function normalizeAreaImages(area: PropertyArea): PropertyImage[] {
  if (!area.images || !Array.isArray(area.images)) return [];
  
  return area.images.map(img => {
    if (typeof img === 'string') {
      return normalizeImage(img);
    }
    return img as PropertyImage;
  });
}

/**
 * Gets area images sorted by sort_order
 */
export function getSortedAreaImages(area: PropertyArea): PropertyImage[] {
  const images = normalizeAreaImages(area);
  
  return images.sort((a, b) => {
    const sortA = a.sort_order !== undefined ? a.sort_order : 0;
    const sortB = b.sort_order !== undefined ? b.sort_order : 0;
    return sortA - sortB;
  });
}

/**
 * Safely updates a property in an area object
 */
export function updateAreaProperty(
  area: PropertyArea, 
  property: keyof PropertyArea, 
  value: any
): PropertyArea {
  return {
    ...area,
    [property]: value
  };
}

/**
 * Maps image IDs to the corresponding area ID
 */
export function getImageAreaMapping(areas: PropertyArea[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  areas.forEach(area => {
    if (area.imageIds && Array.isArray(area.imageIds)) {
      area.imageIds.forEach(imageId => {
        mapping[imageId] = area.id;
      });
    }
  });
  
  return mapping;
}
