
import React from "react";
import { PropertyFormData } from "@/types/property";

interface PropertyStepContentProps {
  formData: PropertyFormData;
  step: number;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  isUploading?: boolean;
}

export function PropertyStepContent({
  formData,
  step,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  isUploading = false
}: PropertyStepContentProps) {
  // This is a placeholder component that would render different content
  // based on the current step in a multi-step form
  return (
    <div>
      <p>Current step: {step}</p>
      {/* Step-specific content would go here */}
    </div>
  );
}
