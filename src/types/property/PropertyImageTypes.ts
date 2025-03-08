
export interface PropertyImage {
  id: string;
  url: string;
  property_id?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  area?: string | null;
  sort_order?: number;
  title?: string;
  description?: string;
  filePath?: string;
  size?: number;
  type?: string;
}
