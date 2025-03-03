
import { usePropertyFetch } from "./property-form/usePropertyFetch";
import { initialFormData } from "./property-form/initialFormData";
import type { PropertyFormData } from "@/types/property";

export function usePropertyForm(id: string | undefined, onSubmit?: (data: PropertyFormData) => void) {
  // Use the separated fetch hook for loading property data
  const { formData, setFormData, isLoading } = usePropertyFetch(id);

  return {
    formData,
    setFormData,
    isLoading
  };
}
