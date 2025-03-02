
import type { PropertyFormData } from "@/types/property";
import { BasicDetails } from "./general-info/BasicDetails";
import { PropertySpecs } from "./general-info/PropertySpecs";
import { DescriptionSection } from "./general-info/DescriptionSection";
import { ImageSelections } from "./general-info/ImageSelections";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void; // Make optional to prevent issues
  onSetFeaturedImage?: (url: string | null) => void;     // Add alternative prop name
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  onSetFeaturedImage,
}: GeneralInfoStepProps) {
  // Make sure formData exists before trying to render the component
  if (!formData) {
    return <div>Loading property information...</div>;
  }

  // Use the appropriate function, with a fallback if neither is provided
  const setFeaturedImageHandler = handleSetFeaturedImage || onSetFeaturedImage || ((url: string | null) => {
    console.log("No featured image handler provided, updating with onFieldChange");
    onFieldChange('featuredImage', url);
  });

  // Log to help with debugging
  console.log("GeneralInfoStep - handleSetFeaturedImage type:", typeof handleSetFeaturedImage);
  console.log("GeneralInfoStep - onSetFeaturedImage type:", typeof onSetFeaturedImage);
  console.log("GeneralInfoStep - setFeaturedImageHandler type:", typeof setFeaturedImageHandler);

  return (
    <div className="space-y-6">
      <BasicDetails formData={formData} onFieldChange={onFieldChange} />
      <PropertySpecs formData={formData} onFieldChange={onFieldChange} />
      <DescriptionSection formData={formData} onFieldChange={onFieldChange} />
      <ImageSelections 
        formData={formData} 
        onFieldChange={onFieldChange} 
        handleSetFeaturedImage={setFeaturedImageHandler} 
      />
    </div>
  );
}
