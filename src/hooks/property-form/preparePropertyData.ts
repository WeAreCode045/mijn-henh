
import { PropertyCity, PropertyFeature, PropertyNearbyPlace, AreaImage } from "@/types/property";

export function preparePropertiesForJsonField<T>(data: T[]): Record<string, unknown>[] {
  return data.map(item => {
    // Use type assertion to handle both specific types and Record<string, unknown>
    return { ...(item as unknown as Record<string, unknown>) };
  });
}
