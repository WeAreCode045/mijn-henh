
import { PropertyData, PropertyImage, PropertyFloorplan } from "@/types/property";

// Convert mixed types to PropertyImage array
export function convertToPropertyImageArray(images: any[]): PropertyImage[] {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: img,
        type: "image"
      };
    }
    
    // If it's already an object, ensure it has the required properties
    return {
      id: img.id || `image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: img.url || '',
      type: img.type || "image",
      alt: img.alt,
      title: img.title,
      description: img.description,
      is_main: img.is_main,
      is_featured_image: img.is_featured_image,
      sort_order: img.sort_order,
      property_id: img.property_id,
      area: img.area,
      filePath: img.filePath
    };
  }) as PropertyImage[];
}

// Convert mixed types to PropertyFloorplan array
export function convertToPropertyFloorplanArray(floorplans: any[]): PropertyFloorplan[] {
  if (!Array.isArray(floorplans)) return [];
  
  return floorplans.map(floorplan => {
    if (typeof floorplan === 'string') {
      return {
        id: `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: floorplan,
        type: "floorplan"
      };
    }
    
    // If it's already an object, ensure it has the required properties
    return {
      id: floorplan.id || `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: floorplan.url || '',
      type: "floorplan",
      title: floorplan.title,
      alt: floorplan.alt,
      description: floorplan.description,
      sort_order: floorplan.sort_order,
      property_id: floorplan.property_id,
      is_featured: floorplan.is_featured,
      columns: floorplan.columns
    };
  }) as PropertyFloorplan[];
}

// Get image URL regardless of the type
export function getImageUrl(image: string | PropertyImage | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}
