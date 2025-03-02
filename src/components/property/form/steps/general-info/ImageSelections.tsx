
import { Label } from "@/components/ui/label";
import type { PropertyFormData } from "@/types/property";
import { GridImagesSection } from "./components/GridImagesSection";

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
      <Label className="text-lg font-medium">Media Selection</Label>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Grid Images Column (converted to full width) */}
        <GridImagesSection 
          formData={formData} 
          onFieldChange={onFieldChange} 
        />
      </div>
    </div>
  );
}
