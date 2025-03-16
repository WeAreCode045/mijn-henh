
/**
 * Legacy area type definition maintained for backward compatibility
 */
export interface Area {
  id: string;
  name?: string;
  title: string;
  description: string;
  size?: string;
  images?: string[] | { url: string; id: string }[];
  imageIds?: string[];
  columns?: number;
}
