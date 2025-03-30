
import { PropertyFormData } from "@/types/property";
import { PropertySpecs } from "./general-info/PropertySpecs";
import { DescriptionSection } from "./general-info/DescriptionSection";
import { ImageSelections } from "./general-info/ImageSelections";
import { useState } from "react";

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
  const handleFeaturedImageSelect = (url: string | null) => {
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
    }
  };

  const handleFeaturedImageToggle = (url: string) => {
    if (handleToggleFeaturedImage) {
      handleToggleFeaturedImage(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Property Specifications */}
      <PropertySpecs 
        formData={{
          price: formData.price || "",
          object_id: formData.object_id || ""
        }}
        onFieldChange={onFieldChange}
        setPendingChanges={setPendingChanges}
      />
      
      {/* Description Section */}
      <DescriptionSection 
        formData={formData}
        onFieldChange={onFieldChange}
        setPendingChanges={setPendingChanges}
      />
      
      {/* Image Selections - Only display if there are images available */}
      {formData.images && formData.images.length > 0 && (
        <ImageSelections
          images={formData.images}
          featuredImage={formData.featuredImage || null}
          featuredImages={formData.featuredImages || []}
          onFeaturedImageSelect={handleFeaturedImageSelect}
          onFeaturedImageToggle={handleFeaturedImageToggle}
          maxFeaturedImages={4}
        />
      )}
    </div>
  );
}
