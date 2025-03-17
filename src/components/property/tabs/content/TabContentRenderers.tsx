
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { ContentTabContent } from './ContentTabContent';

export function renderContentTab({
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
  isSaving
}) {
  // Create a dummy onSubmit function if it's missing
  const onSubmit = () => {
    console.log("Form submitted");
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
      isSaving={isSaving}
      onSubmit={onSubmit}
    />
  );
}
