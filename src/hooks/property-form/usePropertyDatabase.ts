
import { usePropertyCreate } from "./usePropertyCreate";
import { usePropertyUpdate } from "./usePropertyUpdate";
import type { PropertySubmitData } from "@/types/property";

/**
 * Main hook for property database operations
 * Combines create and update functionality
 */
export function usePropertyDatabase() {
  const { createProperty } = usePropertyCreate();
  const { updateProperty } = usePropertyUpdate();
  
  return { updateProperty, createProperty };
}
