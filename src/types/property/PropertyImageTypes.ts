
export interface PropertyImage {
  id: string;
  url: string;
  property_id?: string;
  created_at?: string;
  type?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  area?: string | null;
}
