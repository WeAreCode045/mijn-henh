
import { Label } from "@/components/ui/label";
import type { PropertyFormData } from "@/types/property";
import { FeaturedImageSection } from "./components/FeaturedImageSection";
import { GridImagesSection } from "./components/GridImagesSection";

interface ImageSelectionsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage: (url: string | null) => void;
}

export function ImageSelections({ 
  formData, 
  onFieldChange, 
  handleSetFeaturedImage 
}: ImageSelectionsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">Media Selection</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Image Column */}
        <FeaturedImageSection 
          formData={formData} 
          handleSetFeaturedImage={handleSetFeaturedImage} 
        />
        
        {/* Grid Images Column */}
        <GridImagesSection 
          formData={formData} 
          onFieldChange={onFieldChange} 
        />
      </div>
    </div>
  );
}
