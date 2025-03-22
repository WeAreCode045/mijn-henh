
import { PropertyFormData } from "@/types/property";
import { useState } from "react";
import { PropertySpecs } from "./PropertySpecs";
import { DescriptionSection } from "./DescriptionSection";
import { FeaturesStep } from "../FeaturesStep";

interface GeneralInfoStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (id: string) => void;
  onUpdateFeature?: (id: string, description: string) => void;
}

export function GeneralInfoStep({
  formData,
  onFieldChange,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading,
  setPendingChanges,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature
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
            setPendingChanges={setPendingChanges}
          />
        </div>
        
        {/* 2. Key Information (1/3 width) */}
        <div className="lg:col-span-1">
          <PropertySpecs 
            formData={formData} 
            onFieldChange={handleFieldChange}
            setPendingChanges={setPendingChanges}
          />
        </div>
      </div>

      {/* Features Section */}
      {onAddFeature && onRemoveFeature && onUpdateFeature && (
        <div className="mt-6">
          <FeaturesStep
            formData={formData}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
            onFieldChange={onFieldChange}
            setPendingChanges={setPendingChanges}
            showHeader={false}
          />
        </div>
      )}
    </div>
  );
}
