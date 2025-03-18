
/**
 * Represents an image associated with a property area
 */
export interface AreaImageData {
  id: string;
  url: string;
  area: string;
  type: "image" | "floorplan" | string;
  is_main: boolean;
  is_featured_image: boolean;
  sort_order: number;
  property_id: string;
  created_at?: string;
}
