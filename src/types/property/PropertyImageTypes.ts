
/**
 * Represents a property image
 */
export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  description?: string;
  type?: "image" | "floorplan" | string;
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  property_id?: string;
  area?: string | null;
  filePath?: string;
}
