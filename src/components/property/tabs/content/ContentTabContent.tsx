
import React, { useEffect } from 'react';
import { PropertyFormData } from "@/types/property";
import { PropertyStepContent } from "../../form/PropertyStepContent";

export interface ContentTabContentProps {
  formData: PropertyFormData;
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
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  isUploading?: boolean;
  isSaving?: boolean;
  onSubmit: () => void;
  // Adding these props to fix the TypeScript errors
  handleNext?: () => void;
  handlePrevious?: () => void;
}

export function ContentTabContent({
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
  isSaving,
  onSubmit
}: ContentTabContentProps) {
  // Default implementations if not provided
  const handleNextStep = handleNext || (() => {
    if (currentStep < 3) {
      handleStepClick(currentStep + 1);
    }
  });

  const handlePreviousStep = handlePrevious || (() => {
    if (currentStep > 0) {
      handleStepClick(currentStep - 1);
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Content</h2>
      
      <PropertyStepContent
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
        onAreaImageUpload={handleAreaImageUpload}
        currentStep={currentStep}
        handleStepClick={handleStepClick}
        handleNext={handleNextStep}
        handlePrevious={handlePreviousStep}
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
      />
    </div>
  );
}
