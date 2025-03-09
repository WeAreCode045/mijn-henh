import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";
import { DashboardTabContent } from "./DashboardTabContent";
import { PropertyContentTab } from "../PropertyContentTab";
import { MediaTabContent } from "../wrapper/MediaTabContent";
import { CommunicationsTabContent } from "./CommunicationsTabContent";

export function renderDashboardTab({ activeTab, property }: PropertyTabProps) {
  if (activeTab !== 'dashboard') return null;

  return (
    <DashboardTabContent
      property={property}
    />
  );
}

export function renderContentTab({ activeTab, formState, handlers }: PropertyTabProps) {
  if (activeTab !== 'content') return null;
  
  return (
    <PropertyContentTab
      formData={formState}
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
      handleAreaPhotosUpload={handlers.handleAreaPhotosUpload}
      handleRemoveImage={handlers.handleRemoveImage}
      handleRemoveAreaPhoto={handlers.handleRemoveAreaPhoto}
      handleFloorplanUpload={handlers.handleFloorplanUpload}
      handleRemoveFloorplan={handlers.handleRemoveFloorplan}
      isUpdateMode={true}
      isUploading={handlers.isUploading}
      isUploadingFloorplan={handlers.isUploadingFloorplan}
      handleSetFeaturedImage={handlers.handleSetFeaturedImage}
      handleToggleFeaturedImage={handlers.handleToggleFeaturedImage}
      currentStep={handlers.currentStep}
      handleStepClick={handlers.handleStepClick}
      handleNext={handlers.handleNext}
      handlePrevious={handlers.handlePrevious}
      onSubmit={handlers.onSubmit}
      onFetchLocationData={handlers.onFetchLocationData}
      onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
      isLoadingLocationData={handlers.isLoadingLocationData}
    />
  );
}

export function renderMediaTab({ activeTab, property, formState, handlers }: PropertyTabProps) {
  if (activeTab !== 'media') return null;

  return (
    <MediaTabContent
      id={property.id}
      title={property.title}
      images={formState.images || []}
      virtualTourUrl={property.virtualTourUrl}
      youtubeUrl={property.youtubeUrl}
      floorplanEmbedScript={property.floorplanEmbedScript}
      floorplans={property.floorplans}
      onVirtualTourUpdate={(url: string) => handlers.onFieldChange('virtualTourUrl', url)}
      onYoutubeUrlUpdate={(url: string) => handlers.onFieldChange('youtubeUrl', url)}
      onFloorplanEmbedScriptUpdate={(script: string) => handlers.onFieldChange('floorplanEmbedScript', script)}
      onImageUpload={handlers.handleImageUpload}
      onRemoveImage={handlers.handleRemoveImage}
      onFloorplanUpload={handlers.handleFloorplanUpload}
      onRemoveFloorplan={handlers.handleRemoveFloorplan}
      isUploading={handlers.isUploading}
      isUploadingFloorplan={handlers.isUploadingFloorplan}
      featuredImageUrl={formState.featuredImage || null}
      featuredImageUrls={formState.featuredImages || []}
      onSetFeatured={handlers.handleSetFeaturedImage}
      onToggleFeatured={handlers.handleToggleFeaturedImage}
    />
  );
}

export function renderCommunicationsTab({ activeTab }: PropertyTabProps) {
  if (activeTab !== 'communications') return null;

  return (
    <CommunicationsTabContent />
  );
}
