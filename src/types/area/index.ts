
// Basic area type definitions
export interface Area {
  id: string;
  name: string;
  size?: string;
  description?: string;
}

export interface AreaImage {
  id: string;
  url: string;
  area_id?: string;
  type: "image" | "floorplan";
}

// Re-exports for backwards compatibility
export type { AreaImage as AreaImageData };
