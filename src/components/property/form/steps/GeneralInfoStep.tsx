
import type { PropertyFormData } from "@/types/property";
import { BasicDetails } from "./general-info/BasicDetails";
import { PropertySpecs } from "./general-info/PropertySpecs";
import { DescriptionSection } from "./general-info/DescriptionSection";
import { ImageSelections } from "./general-info/ImageSelections";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage: (url: string | null) => void;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
}: GeneralInfoStepProps) {
  // Make sure formData exists before trying to render the component
  if (!formData) {
    return <div>Loading property information...</div>;
  }

  return (
    <div className="space-y-6">
      <BasicDetails formData={formData} onFieldChange={onFieldChange} />
      <PropertySpecs formData={formData} onFieldChange={onFieldChange} />
      <DescriptionSection formData={formData} onFieldChange={onFieldChange} />
      <ImageSelections 
        formData={formData} 
        onFieldChange={onFieldChange} 
        handleSetFeaturedImage={handleSetFeaturedImage} 
      />
    </div>
  );
}
