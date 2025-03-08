
export interface PropertyFloorplan {
  id: string;
  url: string;
  property_id?: string;
  title?: string;
  description?: string;
  sort_order?: number;
  filePath?: string; // Added based on the error messages
  size?: number;
  type?: string;
}
