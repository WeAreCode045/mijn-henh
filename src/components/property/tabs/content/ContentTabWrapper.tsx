
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { PropertyStepContent } from "@/components/property/form/PropertyStepContent";

interface ContentTabWrapperProps {
  formData: any;
  handlers: any;
}

export function ContentTabWrapper({ formData, handlers }: ContentTabWrapperProps) {
  return (
    <PropertyStepContent
      formData={formData}
      onFieldChange={handlers.onFieldChange}
      onAddFeature={handlers.onAddFeature}
      onRemoveFeature={handlers.onRemoveFeature}
      onUpdateFeature={handlers.onUpdateFeature}
      onAddArea={handlers.onAddArea}
      onRemoveArea={handlers.onRemoveArea}
      onUpdateArea={handlers.onUpdateArea}
      onAreaImageRemove={handlers.onAreaImageRemove}
      onAreaImagesSelect={handlers.onAreaImagesSelect}
      handleAreaImageUpload={handlers.handleAreaImageUpload}
      currentStep={handlers.currentStep}
      handleStepClick={handlers.handleStepClick}
      handleNext={handlers.handleNext}
      handlePrevious={handlers.handlePrevious}
      onFetchLocationData={handlers.onFetchLocationData}
      onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
      isLoadingLocationData={handlers.isLoadingLocationData}
      setPendingChanges={handlers.setPendingChanges}
      isUploading={handlers.isUploading}
    />
  );
}
