
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyFormData } from "@/types/property";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function DescriptionSection({ formData, onFieldChange }: DescriptionSectionProps) {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={formData.description || ''}
        onChange={(e) => onFieldChange('description', e.target.value)}
        placeholder="Description"
      />
    </div>
  );
}
