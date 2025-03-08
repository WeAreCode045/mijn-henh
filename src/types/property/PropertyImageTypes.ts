
/**
 * Represents an image associated with a property
 */
export interface PropertyImage {
  id: string;
  url: string;
  area?: string | null;
  property_id?: string;
  created_at?: string;
  type?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
}
