
import { TabsContent } from "@/components/ui/tabs";
import { DashboardTabContent } from "./DashboardTabContent";
import { ContentTabContent } from "./ContentTabContent";
import { MediaTabContent } from "./MediaTabContent";
import { SettingsTabContent } from "./SettingsTabContent";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";

interface PropertyTabContentsProps {
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
    floorplans: any[];
    virtualTourUrl?: string;
    youtubeUrl?: string;
  };
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
  handleGeneratePDF: () => void;
  handleWebView: () => void;
  // Content tab props
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
  // Media tab props
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleSetFeaturedImage: (url: string) => void;
  handleToggleGridImage: (url: string) => void;
  // Technical data props
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  // Step navigation props
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  onSubmit: () => void;
}

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  agentInfo,
  templateInfo,
  isUpdating,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleSaveTemplate,
  handleGeneratePDF,
  handleWebView,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
  handleImageUpload,
  handleRemoveImage,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  handleUpdateFloorplan,
  handleRemoveAreaPhoto,
  handleSetFeaturedImage,
  handleToggleGridImage,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onSubmit
}: PropertyTabContentsProps) {
  return (
    <>
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
          onSave={onSave}
          onDelete={onDelete}
          onGeneratePDF={handleGeneratePDF}
          onWebView={handleWebView}
        />
      </TabsContent>
      
      <TabsContent value="content">
        <ContentTabContent 
          formData={formState}
          onFieldChange={onFieldChange}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          onUpdateFeature={onUpdateFeature}
          onAddArea={onAddArea}
          onRemoveArea={onRemoveArea}
          onUpdateArea={onUpdateArea}
          onAreaImageUpload={onAreaImageUpload}
          onAreaImageRemove={onAreaImageRemove}
          onAreaImagesSelect={onAreaImagesSelect}
          handleImageUpload={handleImageUpload}
          handleAreaPhotosUpload={handleAreaPhotosUpload}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveImage={handleRemoveImage}
          handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          handleRemoveFloorplan={handleRemoveFloorplan}
          handleUpdateFloorplan={handleUpdateFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleGridImage={handleToggleGridImage}
          onAddTechnicalItem={onAddTechnicalItem}
          onRemoveTechnicalItem={onRemoveTechnicalItem}
          onUpdateTechnicalItem={onUpdateTechnicalItem}
          currentStep={currentStep}
          handleStepClick={handleStepClick}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          onSubmit={onSubmit}
        />
      </TabsContent>
      
      <TabsContent value="media">
        <MediaTabContent 
          id={property.id}
          title={property.title || ""}
          images={property.images || []}
          featuredImage={property.featuredImage}
          gridImages={property.gridImages || []}
          floorplans={property.floorplans || []}
          virtualTourUrl={property.virtualTourUrl}
          youtubeUrl={property.youtubeUrl}
          onUpload={handleImageUpload}
          onRemove={handleRemoveImage}
          onFeaturedImageSelect={handleSetFeaturedImage}
          onGridImageToggle={handleToggleGridImage}
          onFloorplanUpload={handleFloorplanUpload}
          onFloorplanRemove={handleRemoveFloorplan}
          onFloorplanUpdate={handleUpdateFloorplan}
          onVirtualTourUpdate={(url) => onFieldChange('virtualTourUrl', url)}
          onYoutubeUrlUpdate={(url) => onFieldChange('youtubeUrl', url)}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTabContent
          propertyId={property.id}
          objectId={property.object_id}
          agentId={property.agent_id}
          templateId={templateInfo?.id}
          onSaveObjectId={handleSaveObjectId}
          onSaveAgent={handleSaveAgent}
          onSaveTemplate={handleSaveTemplate}
          onDelete={onDelete}
          isUpdating={isUpdating}
        />
      </TabsContent>
    </>
  );
}
