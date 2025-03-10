
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
    console.log("Featured image selected in GeneralInfoStep:", url);
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };

  const handleFeaturedImageToggle = (url: string) => {
    console.log("Featured image toggled in GeneralInfoStep:", url);
    if (handleToggleFeaturedImage) {
      handleToggleFeaturedImage(url);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };

  // Convert images to PropertyImage[] format
  const propertyImages = formData.images?.map(img => {
    if (typeof img === 'string') {
      return { url: img, id: img }; // Use URL as ID if string
    }
    return img;
  }) || [];

  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <BasicDetails 
          formData={formData} 
          onFieldChange={handleFieldChange} 
        />
      </Card>

      <Card>
        <PropertySpecs 
          formData={formData} 
          onFieldChange={handleFieldChange} 
        />
      </Card>

      <DescriptionSection 
        formData={formData}
        onFieldChange={handleFieldChange} 
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
