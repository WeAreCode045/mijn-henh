
import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";
import { DashboardTabContent } from "../wrapper/DashboardTabContent";
import { ContentTabContent } from "../wrapper/ContentTabContent";
import { MediaTabContent } from "../wrapper/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";

export const renderDashboardTab = (props: PropertyTabProps) => {
  if (props.activeTab !== "dashboard") return null;

  const { property, agentInfo, templateInfo, isUpdating, handlers } = props;

  return (
    <DashboardTabContent
      id={property.id}
      title={property.title}
      objectId={property.object_id}
      agentId={property.agent_id}
      createdAt={property.created_at}
      updatedAt={property.updated_at}
      isUpdating={isUpdating}
      onSave={handlers.onSave}
      onDelete={handlers.onDelete}
      handleSaveObjectId={handlers.handleSaveObjectId}
      handleSaveAgent={handlers.handleSaveAgent}
      handleSaveTemplate={handlers.handleSaveTemplate}
      handleGeneratePDF={handlers.handleGeneratePDF}
      handleWebView={handlers.handleWebView}
      // Pass agent and template info
      agentInfo={agentInfo}
      templateInfo={templateInfo}
    />
  );
};

export const renderContentTab = (props: PropertyTabProps) => {
  if (props.activeTab !== "content") return null;

  const { formState, handlers } = props;

  return (
    <ContentTabContent
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
      handleRemoveImage={handlers.handleRemoveImage}
      // Use the correct handler for area photo removal
      handleRemoveAreaPhoto={handlers.handleRemoveAreaPhoto}
      handleAreaPhotosUpload={handlers.handleAreaPhotosUpload}
      handleFloorplanUpload={handlers.handleFloorplanUpload}
      handleRemoveFloorplan={handlers.handleRemoveFloorplan}
      currentStep={handlers.currentStep}
      handleStepClick={handlers.handleStepClick}
      handleNext={handlers.handleNext}
      handlePrevious={handlers.handlePrevious}
      onSubmit={handlers.onSubmit}
      isUploading={handlers.isUploading}
      isUploadingFloorplan={handlers.isUploadingFloorplan}
      handleSetFeaturedImage={handlers.handleSetFeaturedImage}
      handleToggleFeaturedImage={handlers.handleToggleFeaturedImage}
      onAddTechnicalItem={handlers.onAddTechnicalItem}
    />
  );
};

export const renderMediaTab = (props: PropertyTabProps) => {
  if (props.activeTab !== "media") return null;
  
  const { property, handlers } = props;
  
  return (
    <MediaTabContent
      id={property.id}
      title={property.title || ""}
      images={property.images || []}
      virtualTourUrl={property.virtualTourUrl}
      youtubeUrl={property.youtubeUrl}
      notes={property.notes}
      floorplans={property.floorplans || []}
      onImageUpload={handlers.handleImageUpload}
      onRemoveImage={handlers.handleRemoveImage}
      isUploading={handlers.isUploading}
      onFloorplanUpload={handlers.handleFloorplanUpload}
      onRemoveFloorplan={handlers.handleRemoveFloorplan}
      isUploadingFloorplan={handlers.isUploadingFloorplan}
      featuredImageUrl={property.featuredImage}
      featuredImageUrls={property.featuredImages || []}
      onSetFeatured={handlers.handleSetFeaturedImage}
      onToggleFeatured={handlers.handleToggleFeaturedImage}
    />
  );
};

export const renderCommunicationsTab = (props: PropertyTabProps) => {
  if (props.activeTab !== "communications") return null;

  const { property } = props;

  return (
    <CommunicationsTabContent
      id={property.id}
      title={property.title}
    />
  );
};
