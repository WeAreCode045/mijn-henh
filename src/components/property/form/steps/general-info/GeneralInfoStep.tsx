import { PropertyFormData } from "@/types/property";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PropertySpecs } from "./PropertySpecs";
import { BasicDetails } from "./BasicDetails";
import { DescriptionSection } from "./DescriptionSection";
import { ImageSelections } from "./ImageSelections";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleCoverImage?: (url: string) => void;
  isUploading?: boolean;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  handleToggleCoverImage,
  isUploading
}: GeneralInfoStepProps) {
  const handleFeaturedImageSelect = (url: string | null) => {
    console.log("Featured image selected in GeneralInfoStep:", url);
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
    }
  };

  const handleFeaturedImageToggle = (url: string) => {
    console.log("Featured image toggled in GeneralInfoStep:", url);
    if (handleToggleCoverImage) {
      handleToggleCoverImage(url);
    }
  };

  // Convert images to PropertyImage[] format
  const propertyImages = formData.images?.map(img => {
    if (typeof img === 'string') {
      return { url: img, id: img }; // Use URL as ID if string
    }
    return img;
  }) || [];

  return (
    <div className="space-y-6">
      <Card>
        <BasicDetails 
          formData={formData} 
          onFieldChange={onFieldChange} 
        />
      </Card>

      <Card>
        <PropertySpecs 
          formData={formData} 
          onFieldChange={onFieldChange} 
        />
      </Card>

      <DescriptionSection 
        formData={formData}
        onFieldChange={onFieldChange} 
      />

      {/* Only render image selections if there are images */}
      {formData.images && formData.images.length > 0 && (
        <ImageSelections
          images={formData.images}
          featuredImage={formData.featuredImage || null}
          featuredImages={formData.featuredImages || []}
          onFeaturedImageSelect={handleFeaturedImageSelect}
          onFeaturedImageToggle={handleFeaturedImageToggle}
        />
      )}
    </div>
  );
}
