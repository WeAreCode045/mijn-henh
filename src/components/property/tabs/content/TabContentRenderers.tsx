
import { DashboardTabContent } from "../wrapper/DashboardTabContent";
import { ContentTabContent } from "../wrapper/ContentTabContent";
import { MediaTabContent } from "../wrapper/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";

// Common props type to simplify passing data to tab renderers
interface TabRenderProps {
  activeTab: string;
  property: {
    id: string;
    title: string;
    object_id?: string;
    agent_id?: string;
    created_at?: string;
    updated_at?: string;
    images: any[];
    featuredImage?: string; // Made optional
    gridImages?: string[]; // Made optional
    virtualTourUrl?: string;
    youtubeUrl?: string;
    notes?: string;
  };
  formState: any;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  handlers: any;
}

export const renderDashboardTab = ({ activeTab, property, agentInfo, templateInfo, isUpdating, handlers }: TabRenderProps) => {
  if (activeTab !== 'dashboard') return null;
  
  return (
    <DashboardTabContent
      id={property.id}
      objectId={property.object_id}
      title={property.title}
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
};

export const renderContentTab = ({ activeTab, formState, handlers }: TabRenderProps) => {
  if (activeTab !== 'content') return null;
  
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
      handleAreaPhotosUpload={handlers.handleAreaPhotosUpload}
      handleFloorplanUpload={handlers.handleFloorplanUpload}
      handleRemoveImage={handlers.handleRemoveImage}
      handleRemoveAreaPhoto={handlers.handleRemoveAreaPhoto}
      handleRemoveFloorplan={handlers.handleRemoveFloorplan}
      handleUpdateFloorplan={handlers.handleUpdateFloorplan}
      onAddTechnicalItem={handlers.onAddTechnicalItem}
      onRemoveTechnicalItem={handlers.onRemoveTechnicalItem}
      onUpdateTechnicalItem={handlers.onUpdateTechnicalItem}
      currentStep={handlers.currentStep}
      handleStepClick={handlers.handleStepClick}
      handleNext={handlers.handleNext}
      handlePrevious={handlers.handlePrevious}
      onSubmit={handlers.onSubmit}
    />
  );
};

export const renderMediaTab = ({ activeTab, property, handlers }: TabRenderProps) => {
  if (activeTab !== 'media') return null;
  
  return (
    <MediaTabContent
      id={property.id}
      title={property.title}
      images={property.images}
      virtualTourUrl={property.virtualTourUrl}
      youtubeUrl={property.youtubeUrl}
      onVirtualTourUpdate={(url: string) => handlers.onFieldChange('virtualTourUrl', url)}
      onYoutubeUrlUpdate={(url: string) => handlers.onFieldChange('youtubeUrl', url)}
      onNotesUpdate={(notes: string) => handlers.onFieldChange('notes', notes)}
      onImageUpload={handlers.handleImageUpload}
      onRemoveImage={handlers.handleRemoveImage}
      isUploading={handlers.isUploading}
    />
  );
};

export const renderCommunicationsTab = ({ activeTab, property }: TabRenderProps) => {
  if (activeTab !== 'communications') return null;
  
  return (
    <CommunicationsTabContent 
      id={property.id}
      title={property.title}
    />
  );
};
