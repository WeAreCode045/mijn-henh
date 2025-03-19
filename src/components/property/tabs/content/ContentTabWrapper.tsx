
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { ContentTabContent } from "./ContentTabContent";
import { useFormSteps } from "@/hooks/useFormSteps";

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
    handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    setPendingChanges?: (pending: boolean) => void;
    currentStep?: number;
    handleStepClick?: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onFetchCategoryPlaces?: (category: string) => Promise<any>;
    onFetchNearbyCities?: () => Promise<any>;
    onGenerateLocationDescription?: () => Promise<void>;
    onGenerateMap?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    isGeneratingMap?: boolean;
    isUploading?: boolean;
    isSaving?: boolean;
    onSubmit?: () => void;
  };
}

export function ContentTabWrapper({ formData, handlers }: ContentTabWrapperProps) {
  // Local state to manage autosave
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  // Use this as a dummy autosave function since we don't want to implement full
  // autosave functionality in this component right now
  const handleAutosave = () => {
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
    setLastSaved(new Date());
  };
  
  // Initialize form step handling
  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(
    formData,
    handleAutosave,
    5 // Max 5 steps
  );
  
  // Prioritize external step handler if provided
  const stepClickHandler = handlers.handleStepClick || handleStepClick;
  const currentStepValue = handlers.currentStep !== undefined ? handlers.currentStep : currentStep;

  // Create a dummy onSubmit if not provided to prevent loops or errors
  const submitHandler = handlers.onSubmit || (() => {
    console.log("Default submit handler called");
  });

  // We're passing all the handlers individually to avoid TypeScript errors
  return (
    <ContentTabContent
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
      currentStep={currentStepValue}
      handleStepClick={stepClickHandler}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      setPendingChanges={handlers.setPendingChanges || setPendingChanges}
      onFetchLocationData={handlers.onFetchLocationData}
      onFetchCategoryPlaces={handlers.onFetchCategoryPlaces}
      onFetchNearbyCities={handlers.onFetchNearbyCities}
      onGenerateLocationDescription={handlers.onGenerateLocationDescription}
      onGenerateMap={handlers.onGenerateMap}
      onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
      isLoadingLocationData={handlers.isLoadingLocationData}
      isGeneratingMap={handlers.isGeneratingMap}
      isUploading={handlers.isUploading}
      isSaving={handlers.isSaving}
      lastSaved={lastSaved}
      onSubmit={submitHandler}
    />
  );
}
