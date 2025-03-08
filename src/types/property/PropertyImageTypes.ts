
/**
 * Property image type definitions
 */

export interface PropertyImage {
  id: string;
  url: string;
  area?: string | null;
  property_id?: string;
  created_at?: string;
  type?: string;
  sort_order?: number;
  is_main?: boolean;
  is_featured_image?: boolean;
  filePath?: string;
}

// For backward compatibility when using strings or object literals
export type PropertyImageUnion = string | PropertyImage;
