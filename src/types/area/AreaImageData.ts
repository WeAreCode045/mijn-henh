
export interface AreaImageData {
  id: string;
  url: string;
  area: string;
  type: "image" | "floorplan";
  created_at?: string;
  is_featured_image?: boolean;
  is_main?: boolean; 
  property_id?: string;
  sort_order?: number;
}
