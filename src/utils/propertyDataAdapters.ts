
import { PropertyData, PropertyFormData, PropertyImage, PropertyFloorplan, PropertyArea } from "@/types/property";

/**
 * Converts string or mixed arrays to PropertyImage arrays
 */
export function convertToPropertyImageArray(images: (string | PropertyImage)[] | string[] | PropertyImage[]): PropertyImage[] {
  if (!images) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img,
        type: "image" as const
      };
    }
    return img;
  });
}

/**
 * Converts string or mixed arrays to PropertyFloorplan arrays
 */
export function convertToPropertyFloorplanArray(
  floorplans: (string | PropertyImage | PropertyFloorplan)[]
): PropertyFloorplan[] {
  if (!floorplans) return [];
  
  return floorplans.map(plan => {
    if (typeof plan === 'string') {
      return {
        id: `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: plan,
        type: "floorplan" as const
      };
    } else if ((plan as any).type === 'image') {
      // Convert PropertyImage to PropertyFloorplan
      return {
        id: plan.id,
        url: plan.url,
        title: (plan as any).title,
        description: (plan as any).description,
        sort_order: (plan as any).sort_order,
        type: "floorplan" as const
      };
    }
    return plan as PropertyFloorplan;
  });
}

/**
 * Safely gets an image URL regardless of type
 */
export function getImageUrl(image: string | PropertyImage | PropertyFloorplan | null): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}

/**
 * Adapts PropertyFormData to ensure all fields have the correct type
 */
export function adaptPropertyFormData(formData: PropertyFormData): PropertyFormData {
  return {
    ...formData,
    images: convertToPropertyImageArray(formData.images as any),
    floorplans: convertToPropertyFloorplanArray(formData.floorplans as any),
    featuredImages: formData.featuredImages || [],
    coverImages: convertToPropertyImageArray(formData.coverImages as any),
    gridImages: convertToPropertyImageArray(formData.gridImages as any),
    // Ensure areas have correctly typed images
    areas: (formData.areas || []).map(area => ({
      ...area,
      images: convertToPropertyImageArray(area.images as any),
      imageIds: area.imageIds || []
    }))
  };
}
