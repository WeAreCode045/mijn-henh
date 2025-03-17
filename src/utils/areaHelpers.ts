
import { PropertyArea, PropertyImage } from "@/types/property";
import { toPropertyImage } from "./imageUtils";

/**
 * Create a default area with required properties
 */
export function createDefaultArea(): PropertyArea {
  return {
    id: crypto.randomUUID(),
    title: '',
    name: '',
    size: '',
    unit: '',
    description: '',
    columns: 2,
    images: [],
    imageIds: []
  };
}

/**
 * Get a display title for an area
 */
export function getAreaTitle(area: PropertyArea): string {
  return area.title || area.name || 'Unnamed Area';
}

/**
 * Process area images to ensure they're all PropertyImage objects
 */
export function processAreaImages(area: PropertyArea): PropertyImage[] {
  if (!area.images || !Array.isArray(area.images)) return [];
  
  return area.images.map(img => {
    if (typeof img === 'string') {
      return toPropertyImage(img);
    }
    return img as PropertyImage;
  });
}

/**
 * Sort area images by sort_order
 */
export function sortAreaImages(images: PropertyImage[]): PropertyImage[] {
  return [...images].sort((a, b) => {
    const sortA = a.sort_order !== undefined ? a.sort_order : 0;
    const sortB = b.sort_order !== undefined ? b.sort_order : 0;
    return sortA - sortB;
  });
}

/**
 * Update an area safely
 */
export function updateArea(area: PropertyArea, field: keyof PropertyArea, value: any): PropertyArea {
  return {
    ...area,
    [field]: value
  };
}
