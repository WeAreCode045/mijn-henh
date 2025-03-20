
import React from 'react';
import { PropertyTabContentsProps } from './types/PropertyTabTypes';
import { TabContentRenderers } from '../content/TabContentRenderers';

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  agentInfo,
  isUpdating = false,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload, // This prop is used directly
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleSaveTemplate, // Add this parameter
  currentStep,
  handleStepClick,
  setPendingChanges,
  isSaving,
  handleGeneratePDF, // Add missing props
  handleWebView,
  handleImageUpload,
  handleRemoveImage,
  isUploading,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  isUploadingFloorplan,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  handleRemoveAreaPhoto
}: PropertyTabContentsProps) {
  const handlers = {
    onSave,
    onDelete,
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate, // Include in handlers
    onFieldChange,
    onAddFeature,
    onRemoveFeature,
    onUpdateFeature,
    onAddArea,
    onRemoveArea,
    onUpdateArea,
    onAreaImageRemove,
    onAreaImagesSelect,
    handleAreaImageUpload: onAreaImageUpload, // Pass the correct prop here
    onFetchLocationData,
    onFetchCategoryPlaces,
    onFetchNearbyCities,
    onGenerateLocationDescription,
    onGenerateMap,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    currentStep,
    handleStepClick,
    setPendingChanges,
    isSaving: isSaving || false,
    handleWebView // Add the handleWebView prop
  };

  return TabContentRenderers.renderTabContent({
    activeTab,
    property,
    formState,
    agentInfo,
    isUpdating,
    handlers
  });
}
