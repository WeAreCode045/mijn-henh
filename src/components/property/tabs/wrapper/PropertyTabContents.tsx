
import React from 'react';
import { PropertyTabContentsProps } from './types/PropertyTabTypes';
import { TabContentRenderers } from '../content/TabContentRenderers';

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  agentInfo,
  templateInfo,
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
  isSaving
}: PropertyTabContentsProps) {
  return (
    <TabContentRenderers
      activeTab={activeTab}
      property={property}
      formState={formState}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      onAddFeature={onAddFeature}
      onRemoveFeature={onRemoveFeature}
      onUpdateFeature={onUpdateFeature}
      onAddArea={onAddArea}
      onRemoveArea={onRemoveArea}
      onUpdateArea={onUpdateArea}
      onAreaImageRemove={onAreaImageRemove}
      onAreaImagesSelect={onAreaImagesSelect}
      onAreaImageUpload={onAreaImageUpload}
      onFieldChange={onFieldChange}
      onFetchLocationData={onFetchLocationData}
      onFetchCategoryPlaces={onFetchCategoryPlaces}
      onFetchNearbyCities={onFetchNearbyCities}
      onGenerateLocationDescription={onGenerateLocationDescription}
      onGenerateMap={onGenerateMap}
      onRemoveNearbyPlace={onRemoveNearbyPlace}
      isLoadingLocationData={isLoadingLocationData}
      isGeneratingMap={isGeneratingMap}
      onSave={onSave}
      onDelete={onDelete}
      handleSaveObjectId={handleSaveObjectId}
      handleSaveAgent={handleSaveAgent}
      handleSaveTemplate={handleSaveTemplate}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      setPendingChanges={setPendingChanges}
      isSaving={isSaving}
    />
  );
}
