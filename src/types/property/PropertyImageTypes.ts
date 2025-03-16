
export interface PropertyImage {
  id: string;
  url: string;
  area?: string | null;
  property_id?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  type: "image" | "floorplan"; // Strict union type, not allowing other string values
  filePath?: string;
  title?: string;
  description?: string;
}
