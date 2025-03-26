
import { PropertyCity, PropertyFeature, PropertyNearbyPlace, AreaImage } from "@/types/property";

export function preparePropertiesForJsonField<T>(data: T[]): Record<string, unknown>[] {
  return data.map(item => {
    // Use type assertion to handle both specific types and Record<string, unknown>
    return { ...(item as unknown as Record<string, unknown>) };
  });
}

// Add the missing functions
export function prepareAreasForFormSubmission(areas: any[]): any[] {
  if (!areas || !Array.isArray(areas)) return [];
  
  return areas.map(area => {
    // Ensure area has all required properties
    return {
      id: area.id,
      name: area.name || '',
      title: area.title || '',
      description: area.description || '',
      size: area.size || '',
      columns: area.columns || 2,
      imageIds: area.imageIds || [],
      images: area.images || [],
      areaImages: area.areaImages || []
    };
  });
}

export function prepareImagesForSubmission(images: any[]): string[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => typeof img === 'string' ? img : img.url);
}
