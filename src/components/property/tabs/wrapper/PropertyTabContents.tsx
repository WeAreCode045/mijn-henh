
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyTabsValue } from "@/types/navigation";
import { DashboardTabContent } from "@/components/property/tabs/content/DashboardTabContent";
import { ContentTabWrapper } from "@/components/property/tabs/content/ContentTabWrapper";
import { MediaTabContent } from "@/components/property/tabs/content/MediaTabContent";
import { CommunicationsTabContent } from "@/components/property/tabs/content/CommunicationsTabContent";

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, images: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: (index: number) => void;
  isUploading?: boolean;
  isUpdating?: boolean;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveAreaPhoto: (index: number) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan: (index: number) => void;
  isUploadingFloorplan?: boolean;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleFeaturedImage: (url: string) => void;
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (scriptContent: string) => void;
  onDelete?: () => Promise<void>;
  handleSaveObjectId?: (objectId: string) => void;
  handleSaveAgent?: (agentId: string) => void;
  handleSaveTemplate?: (templateId: string) => void;
  handleGeneratePDF?: (e: React.MouseEvent) => void;
  handleWebView?: (e?: React.MouseEvent) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  setPendingChanges?: (pending: boolean) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  onSubmit: () => void;
}

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  handleImageUpload,
  handleRemoveImage,
  isUploading,
  handleAreaPhotosUpload,
  handleRemoveAreaPhoto,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  isUploadingFloorplan,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleSaveTemplate,
  handleGeneratePDF,
  handleWebView,
  isUpdating,
  agentInfo,
  templateInfo,
  currentStep,
  handleStepClick,
  setPendingChanges,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  onSubmit
}: PropertyTabContentsProps) {
  console.log("Rendering tab content for:", activeTab);

  switch (activeTab) {
    case PropertyTabsValue.DASHBOARD:
      return (
        <DashboardTabContent
          property={property}
          onDelete={onDelete}
          onWebView={handleWebView}
          handleSaveAgent={handleSaveAgent}
          handleSaveObjectId={handleSaveObjectId}
          handleSaveTemplate={handleSaveTemplate}
          handleGeneratePDF={handleGeneratePDF}
          isUpdating={isUpdating}
          agentInfo={agentInfo}
          templateInfo={templateInfo}
        />
      );
    case PropertyTabsValue.CONTENT:
      return (
        <ContentTabWrapper
          property={property}
          formData={formState}
          onFieldChange={onFieldChange}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          onUpdateFeature={onUpdateFeature}
          onAddArea={onAddArea}
          onRemoveArea={onRemoveArea}
          onUpdateArea={onUpdateArea}
          onAreaImageRemove={onAreaImageRemove}
          onAreaImagesSelect={onAreaImagesSelect}
          onAreaImageUpload={onAreaImageUpload}
          currentStep={currentStep}
          handleStepClick={handleStepClick}
          setPendingChanges={setPendingChanges}
          onFetchLocationData={onFetchLocationData}
          onFetchCategoryPlaces={onFetchCategoryPlaces}
          onFetchNearbyCities={onFetchNearbyCities}
          onGenerateLocationDescription={onGenerateLocationDescription}
          onGenerateMap={onGenerateMap}
          onRemoveNearbyPlace={onRemoveNearbyPlace}
          isLoadingLocationData={isLoadingLocationData}
          isGeneratingMap={isGeneratingMap}
          onSubmit={onSubmit}
        />
      );
    case PropertyTabsValue.MEDIA:
      return (
        <MediaTabContent
          property={property}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          isUploading={isUploading}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveFloorplan={handleRemoveFloorplan}
          isUploadingFloorplan={isUploadingFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleFeaturedImage={handleToggleFeaturedImage}
          handleVirtualTourUpdate={handleVirtualTourUpdate}
          handleYoutubeUrlUpdate={handleYoutubeUrlUpdate}
          handleFloorplanEmbedScriptUpdate={handleFloorplanEmbedScriptUpdate}
          virtualTourUrl={formState.virtualTourUrl}
          youtubeUrl={formState.youtubeUrl}
          floorplanEmbedScript={formState.floorplanEmbedScript}
        />
      );
    case PropertyTabsValue.COMMUNICATIONS:
      return (
        <CommunicationsTabContent
          property={property}
        />
      );
    default:
      return <div>No content available for this tab</div>;
  }
}
