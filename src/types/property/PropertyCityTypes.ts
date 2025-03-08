
/**
 * Represents a city nearby to a property
 */
export interface PropertyCity {
  id: string;
  name: string;
  distance?: number;
  visible?: boolean;
  population?: number;
  description?: string;
}
