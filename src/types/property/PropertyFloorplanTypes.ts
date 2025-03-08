
/**
 * Property floorplan type definitions
 */

export interface PropertyFloorplan {
  id: string;
  url: string;
  name?: string;
  description?: string;
  filePath?: string;
  property_id?: string;
  type?: string;
  sort_order?: number;
}
