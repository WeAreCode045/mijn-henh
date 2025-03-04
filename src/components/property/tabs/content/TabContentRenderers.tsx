import { DashboardTabContent } from "../wrapper/DashboardTabContent";
import { ContentTabContent } from "../wrapper/ContentTabContent";
import { MediaTabContent } from "../wrapper/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";
import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";

// Dashboard Tab
export function renderDashboardTab(tabProps: PropertyTabProps) {
  const { activeTab, property, agentInfo, templateInfo, isUpdating, handlers, formState } = tabProps;

  if (activeTab !== 'dashboard') return null;

  return (
    <DashboardTabContent
      id={property.id}
      title={property.title}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      isUpdating={isUpdating}
      onSave={handlers.onSave}
      onDelete={handlers.onDelete}
      handleSaveObjectId={handlers.handleSaveObjectId}
      handleSaveAgent={handlers.handleSaveAgent}
      handleSaveTemplate={handlers.handleSaveTemplate}
      handleGeneratePDF={handlers.handleGeneratePDF}
      handleWebView={handlers.handleWebView}
      currentStep={handlers.currentStep}
      handleStepClick={handlers.handleStepClick}
      handleNext={handlers.handleNext}
      handlePrevious={handlers.handlePrevious}
      onSubmit={handlers.onSubmit}
      formState={formState}
    />
  );
}

// Content Tab
export function renderContentTab(tabProps: PropertyTabProps) {
  const { activeTab, property, handlers, formState } = tabProps;

  if (activeTab !== 'content') return null;

  return (
    <ContentTabContent
      id={property.id}
      title={property.title}
      formState={formState}
      onFieldChange={handlers.onFieldChange}
      onAddFeature={handlers.onAddFeature}
      onRemoveFeature={handlers.onRemoveFeature}
      onUpdateFeature={handlers.onUpdateFeature}
      onAddTechnicalItem={handlers.onAddTechnicalItem}
      onRemoveTechnicalItem={handlers.onRemoveTechnicalItem}
      onUpdateTechnicalItem={handlers.onUpdateTechnicalItem}
      onAddArea={handlers.onAddArea}
      onRemoveArea={handlers.onRemoveArea}
      onUpdateArea={handlers.onUpdateArea}
      onAreaImageUpload={handlers.onAreaImageUpload}
      onAreaImageRemove={handlers.onAreaImageRemove}
      onAreaImagesSelect={handlers.onAreaImagesSelect}
    />
  );
}

// Update the renderMediaTab function to pass the featured and grid image properties
export function renderMediaTab(tabProps: PropertyTabProps) {
  const { activeTab, property, handlers } = tabProps;
  
  if (activeTab !== 'media') return null;
  
  return (
    <MediaTabContent
      id={property.id}
      title={property.title}
      images={property.images || []}
      virtualTourUrl={property.virtualTourUrl}
      youtubeUrl={property.youtubeUrl}
      notes={property.notes}
      onVirtualTourUpdate={(url) => handlers.onFieldChange('virtualTourUrl', url)}
      onYoutubeUrlUpdate={(url) => handlers.onFieldChange('youtubeUrl', url)}
      onNotesUpdate={(notes) => handlers.onFieldChange('notes', notes)}
      onImageUpload={handlers.handleImageUpload}
      onRemoveImage={handlers.handleRemoveImage}
      isUploading={handlers.isUploading}
      // Add the new properties
      featuredImageUrl={property.featuredImage}
      gridImageUrls={property.gridImages}
      onSetFeatured={handlers.handleSetFeaturedImage}
      onToggleGrid={handlers.handleToggleGridImage}
    />
  );
}

// Communications Tab
export function renderCommunicationsTab(tabProps: PropertyTabProps) {
  const { activeTab } = tabProps;

  if (activeTab !== 'communications') return null;

  return (
    <CommunicationsTabContent />
  );
}
