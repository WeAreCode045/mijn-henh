
export interface PropertyArea {
  id: string;
  name: string;
  size: string;
  images: any[];
  
  // Additional fields required by components
  title: string;
  description: string;
  imageIds: string[];
  columns: number;
}
