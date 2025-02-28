
import { TabsContent } from "@/components/ui/tabs";
import { DashboardTabContent } from "../wrapper/DashboardTabContent";
import { ContentTabContent } from "../wrapper/ContentTabContent";
import { MediaTabContent } from "../wrapper/MediaTabContent";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";

interface TabContentProps {
  activeTab: string;
  property: {
    id: string;
    object_id?: string;
    title: string;
    agent_id?: string;
    created_at?: string;
    updated_at?: string;
    images: any[];
    featuredImage: string | null;
    gridImages: string[];
    virtualTourUrl?: string;
    youtubeUrl?: string;
  };
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  handlers: {
    // Dashboard tab handlers
    onSave: () => void;
    onDelete: () => Promise<void>;
    handleSaveObjectId: (objectId: string) => void;
    handleSaveAgent: (agentId: string) => void;
    handleSaveTemplate: (templateId: string) => void;
    handleGeneratePDF: () => void;
    handleWebView: () => void;
    // Content tab handlers
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea: () => void;
    onRemoveArea: (id: string) => void;
    onUpdateArea: (id: string, field: any, value: any) => void;
    onAreaImageUpload: (areaId: string, files: FileList) => void;
    onAreaImageRemove: (areaId: string, imageId: string) => void;
    onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
    // Media tab handlers
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: (index: number) => void;
    isUploading?: boolean;
    handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveAreaPhoto: (index: number) => void;
    handleRemoveFloorplan: (index: number) => void;
    handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
    handleSetFeaturedImage: (url: string) => void;
    handleToggleGridImage: (url: string) => void;
    // Technical data handlers
    onAddTechnicalItem?: () => void;
    onRemoveTechnicalItem?: (id: string) => void;
    onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
    // Step navigation handlers
    currentStep: number;
    handleStepClick: (step: number) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    onSubmit: () => void;
  };
}

/**
 * Renders the Dashboard tab content
 */
export const renderDashboardTab = (props: TabContentProps) => {
  const { property, agentInfo, templateInfo, isUpdating, handlers } = props;
  
  return (
    <TabsContent value="dashboard">
      <DashboardTabContent 
        id={property.id}
        objectId={property.object_id}
        title={property.title || "Untitled Property"}
        agentId={property.agent_id}
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
    </TabsContent>
  );
};

/**
 * Renders the Content tab
 */
export const renderContentTab = (props: TabContentProps) => {
  const { formState, handlers } = props;
  
  return (
    <TabsContent value="content">
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
        handleSetFeaturedImage={handlers.handleSetFeaturedImage}
        handleToggleGridImage={handlers.handleToggleGridImage}
        onAddTechnicalItem={handlers.onAddTechnicalItem}
        onRemoveTechnicalItem={handlers.onRemoveTechnicalItem}
        onUpdateTechnicalItem={handlers.onUpdateTechnicalItem}
        currentStep={handlers.currentStep}
        handleStepClick={handlers.handleStepClick}
        handleNext={handlers.handleNext}
        handlePrevious={handlers.handlePrevious}
        onSubmit={handlers.onSubmit}
      />
    </TabsContent>
  );
};

/**
 * Renders the Media tab
 */
export const renderMediaTab = (props: TabContentProps) => {
  const { property, handlers } = props;
  
  return (
    <TabsContent value="media">
      <MediaTabContent 
        id={property.id}
        title={property.title || ""}
        images={property.images || []}
        featuredImage={property.featuredImage}
        gridImages={property.gridImages || []}
        virtualTourUrl={property.virtualTourUrl}
        youtubeUrl={property.youtubeUrl}
        onUpload={handlers.handleImageUpload}
        onRemove={handlers.handleRemoveImage}
        onFeaturedImageSelect={handlers.handleSetFeaturedImage}
        onGridImageToggle={handlers.handleToggleGridImage}
        onVirtualTourUpdate={(url) => handlers.onFieldChange('virtualTourUrl', url)}
        onYoutubeUrlUpdate={(url) => handlers.onFieldChange('youtubeUrl', url)}
        onImageUpload={handlers.handleImageUpload}
        onRemoveImage={handlers.handleRemoveImage}
        isUploading={handlers.isUploading}
      />
    </TabsContent>
  );
};
