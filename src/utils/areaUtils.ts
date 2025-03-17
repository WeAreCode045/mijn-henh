
import { PropertyArea, PropertyImage } from "@/types/property";
import { normalizeImage } from "./imageHelpers";

/**
 * Creates a new PropertyArea with default values
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
 * Safely get area title with fallback
 */
export function getAreaTitle(area: PropertyArea): string {
  return area.title || area.name || 'Unnamed Area';
}

/**
 * Normalize area images to ensure they're PropertyImage objects
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
 * Update a PropertyArea safely with partial data
 */
export function updateArea(area: PropertyArea, updates: Partial<PropertyArea>): PropertyArea {
  return {
    ...area,
    ...updates
  };
}
