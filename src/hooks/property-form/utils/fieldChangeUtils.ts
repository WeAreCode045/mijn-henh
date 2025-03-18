
import { PropertyFormData } from "@/types/property";

/**
 * Creates a wrapper for handleFieldChange that accepts a data object
 */
export const createFieldChangeWrapper = (
  handleFieldChange: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void
) => {
  return (data: Partial<PropertyFormData>) => {
    // For each property in data, call handleFieldChange
    Object.entries(data).forEach(([key, value]) => {
      handleFieldChange(key as keyof PropertyFormData, value as any);
    });
  };
};
