
/**
 * Represents a floorplan associated with a property
 */
export interface PropertyFloorplan {
  id: string;
  url: string;
  filePath?: string;
  name?: string;
  type?: string;
  property_id?: string;
  created_at?: string;
  sort_order?: number;
}
