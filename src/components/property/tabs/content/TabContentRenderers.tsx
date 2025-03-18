
import React from 'react';
import { PropertyFormData } from "@/types/property";
import { ContentTabContent } from './ContentTabContent';

// Create a single tab content renderer function
const renderContentTab = ({
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
}) => {
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
};

// Export the TabContentRenderers object
export const TabContentRenderers = {
  renderContentTab,
  renderTabContent: ({ activeTab, property, formState, agentInfo, templateInfo, isUpdating, handlers }) => {
    // Add logic to render the appropriate tab content based on activeTab
    if (activeTab === 'content') {
      return renderContentTab({
        formData: formState,
        ...handlers,
        handleNext: () => {
          if (handlers.currentStep < 3) {
            handlers.handleStepClick(handlers.currentStep + 1);
          }
        },
        handlePrevious: () => {
          if (handlers.currentStep > 0) {
            handlers.handleStepClick(handlers.currentStep - 1);
          }
        }
      });
    }
    
    // For other tabs, return null or other content
    return null;
  }
};
