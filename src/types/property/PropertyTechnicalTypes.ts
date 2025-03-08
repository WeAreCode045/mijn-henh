
export interface PropertyTechnicalItem {
  id: string;
  title: string;
  size: string;
  description: string;
  floorplanId: string | null;
  columns?: number;
}

export interface PropertyFloorplan {
  id: string;
  url: string;
  filePath?: string;
  columns?: number;
  title?: string;
  sort_order?: number;
}
