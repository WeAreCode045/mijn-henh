
import { PropertyFormData } from "@/types/property";
import { PropertySpecs } from "./PropertySpecs";
import { DescriptionSection } from "./DescriptionSection";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading,
  setPendingChanges
}: GeneralInfoStepProps) {
  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Property Description (2/3 width) */}
        <div className="lg:col-span-2">
          <DescriptionSection 
            formData={formData}
            onFieldChange={handleFieldChange} 
          />
        </div>
        
        {/* 2. Key Information (1/3 width) */}
        <div className="lg:col-span-1">
          <PropertySpecs 
            formData={{
              price: formData.price || "",
              object_id: formData.object_id || ""
            }}
            onFieldChange={handleFieldChange} 
          />
        </div>
      </div>
    </div>
  );
}
