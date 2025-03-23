
import type { PropertyFormData } from "@/types/property";

interface GridImagesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function GridImagesSection({ 
  formData, 
  onFieldChange 
}: GridImagesSectionProps) {
  // This component is now empty as the functionality has been moved elsewhere
  return null;
}
