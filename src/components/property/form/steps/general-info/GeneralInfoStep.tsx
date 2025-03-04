
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
  handleToggleGridImage?: (url: string) => void;
  isUploading?: boolean;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  handleToggleGridImage,
  isUploading
}: GeneralInfoStepProps) {
  const handleFeaturedImageSelect = (url: string | null) => {
    console.log("Featured image selected in GeneralInfoStep:", url);
    if (handleSetFeaturedImage) {
      handleSetFeaturedImage(url);
    }
  };

  const handleGridImageToggle = (url: string) => {
    console.log("Grid image toggled in GeneralInfoStep:", url);
    if (handleToggleGridImage) {
      handleToggleGridImage(url);
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
        description={formData.description || ''} 
        locationDescription={formData.location_description || ''} 
        onFieldChange={onFieldChange} 
      />

      <ImageSelections 
        images={propertyImages}
        featuredImage={formData.featuredImage}
        gridImages={formData.gridImages || []}
        onFeaturedImageSelect={handleFeaturedImageSelect}
        onGridImageToggle={handleGridImageToggle}
      />
    </div>
  );
}
