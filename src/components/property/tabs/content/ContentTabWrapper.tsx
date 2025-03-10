
import React from "react";
import { PropertyFormData } from "@/types/property";
import { PropertyStepContent } from "../PropertyStepContent";

export interface ContentTabWrapperProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function ContentTabWrapper({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  handleAreaImageUpload,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  isUploading = false,
  setPendingChanges = () => {}
}: ContentTabWrapperProps) {
  // You can add any additional logic needed for the content tab wrapper here
  
  return (
    <PropertyStepContent
      formData={formData}
      step={currentStep}
      onFieldChange={onFieldChange}
      onAddFeature={onAddFeature}
      onRemoveFeature={onRemoveFeature}
      onUpdateFeature={onUpdateFeature}
      onAddArea={onAddArea}
      onRemoveArea={onRemoveArea}
      onUpdateArea={onUpdateArea}
      onAreaImageRemove={onAreaImageRemove}
      onAreaImagesSelect={onAreaImagesSelect}
      onAreaImageUpload={handleAreaImageUpload}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      isUploading={isUploading}
    />
  );
}
