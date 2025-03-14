
import { PropertyFormData } from "@/types/property";
import { useState } from "react";
import { ContentTabContent } from "./ContentTabContent";
import { usePropertyContent } from "@/hooks/usePropertyContent";

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea: () => void;
    onRemoveArea: (id: string) => void;
    onUpdateArea: (id: string, field: any, value: any) => void;
    onAreaImageRemove: (areaId: string, imageId: string) => void;
    onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

export function ContentTabWrapper({ formData, handlers }: ContentTabWrapperProps) {
  // Extract handlers
  const {
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
    onFetchLocationData,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    setPendingChanges,
    isUploading,
    onSubmit,
    isSaving
  } = handlers;

  // Define local step handling functions that prevent default form submission
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentStep < 3) { // 3 is the max step (0-indexed)
      handleStepClick(currentStep + 1);
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentStep > 0) {
      handleStepClick(currentStep - 1);
    }
  };

  return (
    <ContentTabContent
      formData={formData}
      onFieldChange={onFieldChange}
      onAddFeature={onAddFeature}
      onRemoveFeature={onRemoveFeature}
      onUpdateFeature={onUpdateFeature}
      onAddArea={onAddArea}
      onRemoveArea={onRemoveArea}
      onUpdateArea={onUpdateArea}
      onAreaImageRemove={onAreaImageRemove}
      onAreaImagesSelect={onAreaImagesSelect}
      handleAreaImageUpload={handleAreaImageUpload}
      currentStep={currentStep}
      handleStepClick={(step) => {
        // Prevent default event and call the step click handler
        handleStepClick(step);
      }}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      onFetchLocationData={onFetchLocationData}
      onRemoveNearbyPlace={onRemoveNearbyPlace}
      isLoadingLocationData={isLoadingLocationData}
      setPendingChanges={setPendingChanges}
      isUploading={isUploading}
      onSubmit={onSubmit}
      isSaving={isSaving}
    />
  );
}
