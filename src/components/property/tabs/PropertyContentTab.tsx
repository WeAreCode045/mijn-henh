
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { ContentTabWrapper } from './content/ContentTabWrapper';

interface PropertyContentTabProps {
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
  handleNext: () => void;
  handlePrevious: () => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  isUploading?: boolean;
}

export function PropertyContentTab({ 
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
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges,
  isUploading
}: PropertyContentTabProps) {
  return (
    <ContentTabWrapper 
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
      handleStepClick={handleStepClick}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      onFetchLocationData={onFetchLocationData}
      onRemoveNearbyPlace={onRemoveNearbyPlace}
      isLoadingLocationData={isLoadingLocationData}
      setPendingChanges={setPendingChanges}
      isUploading={isUploading}
    />
  );
}
