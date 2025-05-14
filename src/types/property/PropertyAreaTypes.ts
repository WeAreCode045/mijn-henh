
export interface PropertyArea {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  area_type?: string;
  sort_order?: number;
}

export interface AreaImage {
  id: string;
  url: string;
  property_id?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  type?: string;
  area?: string | null;
  sort_order?: number;
  filePath?: string;
  title?: string;
  description?: string;
  columns?: number;
}
