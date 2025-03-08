
/**
 * Represents a technical item associated with a property
 */
export interface PropertyTechnicalItem {
  id: string;
  title: string;
  size: string;
  description: string;
  floorplanId: string | null;
  columns?: number;
}
