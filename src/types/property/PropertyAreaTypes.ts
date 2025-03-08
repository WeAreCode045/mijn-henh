
export interface PropertyArea {
  id: string;
  name?: string;
  size?: string;
  images?: string[];
  // Add these properties that are being used in the codebase
  title: string;
  description: string;
  imageIds: string[];
  columns: number;
}
