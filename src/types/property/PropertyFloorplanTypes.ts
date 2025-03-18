
/**
 * Represents a property floorplan
 */
export interface PropertyFloorplan {
  id: string;
  url: string;
  title?: string;
  alt?: string;
  description?: string;
  filePath?: string;
  sort_order?: number;
  property_id?: string;
  is_featured?: boolean;
  timestamp?: string;
  type: "floorplan";
  columns?: number;
}
