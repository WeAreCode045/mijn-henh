
export interface PropertyImage {
  id: string;
  url: string;
  area?: string | null;
  is_main?: boolean;
  is_featured_image?: boolean;
  type?: string;
  property_id?: string;
  created_at?: string;
  sort_order?: number;
}
