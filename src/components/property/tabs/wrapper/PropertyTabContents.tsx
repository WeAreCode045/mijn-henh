
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
  onAreaImageUpload, 
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
  handleSaveTemplate,
  currentStep,
  handleStepClick,
  setPendingChanges,
  isSaving,
  handleGeneratePDF,
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
  handleRemoveAreaPhoto,
  isArchived
}: PropertyTabContentsProps) {
  const handlers = {
    onSave,
    onDelete,
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate,
    onFieldChange,
    onAddFeature,
    onRemoveFeature,
    onUpdateFeature,
    onAddArea,
    onRemoveArea,
    onUpdateArea,
    onAreaImageRemove,
    onAreaImagesSelect,
    handleAreaImageUpload: onAreaImageUpload,
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
    handleWebView,
    handleGeneratePDF
  };

  return TabContentRenderers.renderTabContent({
    activeTab,
    property,
    formState,
    agentInfo,
    isUpdating,
    isArchived,
    handlers
  });
}
