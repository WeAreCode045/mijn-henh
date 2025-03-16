
export interface PropertyImage {
  id: string;
  url: string;
  area?: string | null;
  property_id?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  type: "image" | "floorplan" | string; // Changed from string-only to union type to accommodate type checking
  filePath?: string;
  title?: string;
  description?: string;
}
