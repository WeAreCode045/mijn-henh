
import { Label } from "@/components/ui/label";
import type { PropertyFormData } from "@/types/property";

interface ImageSelectionsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function ImageSelections({ 
  formData, 
  onFieldChange
}: ImageSelectionsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">Image Selection</Label>
      <div className="text-muted-foreground text-sm">
        Please use the Media tab to manage property images.
      </div>
    </div>
  );
}

