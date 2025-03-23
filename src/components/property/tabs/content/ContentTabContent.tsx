
import React, { memo } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { PropertyStepWizard } from '../../form/PropertyStepWizard';

interface ContentTabContentProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: any, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  isUploading?: boolean;
  isUpdateMode?: boolean;
  onSubmit: () => void;
  isSaving?: boolean;
  hideNavigation?: boolean;
  isReadOnly?: boolean;
}

// Using memo to prevent unnecessary re-renders
export const ContentTabContent = memo(function ContentTabContent({
  property,
  formState,
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
  onFetchLocationData,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges,
  isUploading,
  isUpdateMode = false,
  onSubmit,
  isSaving,
  hideNavigation = false,
  isReadOnly = false
}: ContentTabContentProps) {
  
  console.log("ContentTabContent rendering, step:", currentStep);
  console.log("ContentTabContent onFieldChange is defined:", !!onFieldChange);
  console.log("FormState has keys:", Object.keys(formState).join(", "));
  
  // We need this check to prevent passing undefined handlers down
  const handleSafeFieldChange = (field: keyof PropertyFormData, value: any) => {
    console.log(`ContentTabContent handleSafeFieldChange: ${String(field)} = `, value);
    if (onFieldChange) {
      onFieldChange(field, value);
    } else {
      console.warn("onFieldChange is not defined in ContentTabContent");
    }
  };
  
  const handleSafeSetPendingChanges = (pending: boolean) => {
    console.log("ContentTabContent setPendingChanges:", pending);
    if (setPendingChanges) {
      setPendingChanges(pending);
    } else {
      console.warn("setPendingChanges is not defined in ContentTabContent");
    }
  };
  
  return (
    <PropertyStepWizard
      property={property}
      formState={formState}
      onFieldChange={handleSafeFieldChange}
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
      onFetchLocationData={onFetchLocationData}
      onRemoveNearbyPlace={onRemoveNearbyPlace}
      isLoadingLocationData={isLoadingLocationData}
      setPendingChanges={handleSafeSetPendingChanges}
      isUploading={isUploading}
      onSubmit={onSubmit}
      isSaving={isSaving}
      isReadOnly={isReadOnly}
      hideNavigation={hideNavigation}
    />
  );
});
