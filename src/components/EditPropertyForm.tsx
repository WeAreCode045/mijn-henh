
import { PropertyForm } from "./PropertyForm";
import type { PropertyFormData } from "@/types/property";

interface EditPropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
}

export function EditPropertyForm({ onSubmit }: EditPropertyFormProps) {
  return <PropertyForm onSubmit={onSubmit} />;
}
