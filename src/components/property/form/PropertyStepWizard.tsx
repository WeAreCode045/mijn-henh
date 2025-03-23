
import React from "react";
import { PropertyFormData, PropertyData } from "@/types/property";
import { PropertyStepContent } from "./PropertyStepContent";

interface PropertyStepWizardProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (id: string) => void;
  onUpdateFeature?: (id: string, description: string) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: any, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  isUploading?: boolean;
  onSubmit?: () => void;
  isSaving?: boolean;
  isReadOnly?: boolean;
  hideNavigation?: boolean;
}

export function PropertyStepWizard({
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
  onAreaImageUpload,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  setPendingChanges,
  isUploading,
  onSubmit,
  isSaving,
  isReadOnly = false,
  hideNavigation = false
}: PropertyStepWizardProps) {
  
  // Create wrapper functions that match the expected signatures
  // Changed to directly use the original functions instead of creating new ones with e.preventDefault()
  // Since the child component expects functions without parameters
  
  return (
    <div className="space-y-6">
      <PropertyStepContent
        formData={formState}
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
        onAreaImageUpload={onAreaImageUpload}
        currentStep={currentStep}
        handleStepClick={handleStepClick}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        onFetchLocationData={onFetchLocationData}
        onFetchCategoryPlaces={onFetchCategoryPlaces}
        onFetchNearbyCities={onFetchNearbyCities}
        onGenerateLocationDescription={onGenerateLocationDescription}
        onGenerateMap={onGenerateMap}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        isLoadingLocationData={isLoadingLocationData}
        isGeneratingMap={isGeneratingMap}
        setPendingChanges={setPendingChanges}
        isUploading={isUploading}
        onSubmit={onSubmit}
        isSaving={isSaving}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
