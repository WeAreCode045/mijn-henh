
import { DashboardTabContent } from "../wrapper/DashboardTabContent";
import { ContentTabContent } from "../wrapper/ContentTabContent";
import { MediaTabContent } from "../wrapper/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";
import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";

// Dashboard Tab
export function renderDashboardTab(tabProps: PropertyTabProps) {
  const { activeTab, property, agentInfo, templateInfo, isUpdating, handlers } = tabProps;

  if (activeTab !== 'dashboard') return null;

  return (
    <DashboardTabContent
      id={property.id}
      title={property.title}
      objectId={property.object_id}
      agentId={agentInfo?.id}
      agentName={agentInfo?.name}
      templateId={templateInfo?.id}
      templateName={templateInfo?.name}
      createdAt={property.created_at}
      updatedAt={property.updated_at}
      onSave={handlers.onSave}
      onDelete={handlers.onDelete}
      onGeneratePDF={handlers.handleGeneratePDF}
      onWebView={handlers.handleWebView}
      onSaveAgent={handlers.handleSaveAgent}
      onSaveObjectId={handlers.handleSaveObjectId}
      onSaveTemplate={handlers.handleSaveTemplate}
      isUpdating={isUpdating}
    />
  );
}

// Content Tab
export function renderContentTab(tabProps: PropertyTabProps) {
  const { activeTab, property, handlers } = tabProps;

  if (activeTab !== 'content') return null;

  return (
    <ContentTabContent
      formData={handlers.formState}
      onFieldChange={handlers.onFieldChange}
      onAddFeature={handlers.onAddFeature}
      onRemoveFeature={handlers.onRemoveFeature}
      onUpdateFeature={handlers.onUpdateFeature}
      onAddArea={handlers.onAddArea}
      onRemoveArea={handlers.onRemoveArea}
      onUpdateArea={handlers.onUpdateArea}
      onAreaImageUpload={handlers.onAreaImageUpload}
      onAreaImageRemove={handlers.onAreaImageRemove}
      onAreaImagesSelect={handlers.onAreaImagesSelect}
      handleImageUpload={handlers.handleImageUpload}
      handleAreaPhotosUpload={handlers.handleImageUpload} // Using same handler for simplicity
      handleFloorplanUpload={handlers.handleImageUpload} // Using same handler for simplicity
      handleRemoveImage={handlers.handleRemoveImage}
      handleRemoveAreaPhoto={handlers.handleRemoveImage} // Using same handler for simplicity
      handleRemoveFloorplan={handlers.handleRemoveImage} // Using same handler for simplicity
      onAddTechnicalItem={handlers.onAddTechnicalItem}
      onRemoveTechnicalItem={handlers.onRemoveTechnicalItem}
      onUpdateTechnicalItem={handlers.onUpdateTechnicalItem}
      currentStep={handlers.currentStep}
      handleStepClick={handlers.handleStepClick}
      handleNext={handlers.handleNext}
      handlePrevious={handlers.handlePrevious}
      onSubmit={handlers.onSubmit}
      isUploading={handlers.isUploading}
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
  const { activeTab, property } = tabProps;

  if (activeTab !== 'communications') return null;

  return (
    <CommunicationsTabContent 
      id={property.id}
      title={property.title}
    />
  );
}
