
import { PropertyFormData } from "@/types/property";
import { renderTabContent } from "../content/TabContentRenderers";

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
    floorplans?: any[];
    virtualTourUrl?: string;
    youtubeUrl?: string;
    notes?: string;
    floorplanEmbedScript?: string;
  };
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
  handleGeneratePDF: () => void;
  handleWebView: () => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isUploading?: boolean;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan: (index: number) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  onSubmit: () => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploadingFloorplan?: boolean;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  handleVirtualTourUpdate?: (url: string) => void;
  handleYoutubeUrlUpdate?: (url: string) => void;
  handleFloorplanEmbedScriptUpdate?: (script: string) => void;
  // Media components
  onFeatureImageToggle?: (url: string) => void;
  onSetMainImage?: (url: string) => void;
}

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  agentInfo,
  templateInfo,
  isUpdating,
  isSaving,
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
  onAreaImageRemove,
  onAreaImagesSelect,
  handleAreaImageUpload,
  handleImageUpload,
  handleRemoveImage,
  isUploading,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  currentStep,
  handleStepClick,
  onSubmit,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploadingFloorplan,
  handleRemoveAreaPhoto,
  onFetchLocationData,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges = () => {},
  handleVirtualTourUpdate = () => {},
  handleYoutubeUrlUpdate = () => {},
  handleFloorplanEmbedScriptUpdate = () => {},
  onFeatureImageToggle,
  onSetMainImage
}: PropertyTabContentsProps) {
  const handlers = {
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
    onAreaImageRemove,
    onAreaImagesSelect,
    handleAreaImageUpload,
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    currentStep,
    handleStepClick,
    onSubmit,
    formState,
    isUploadingFloorplan,
    handleSetFeaturedImage: handleSetFeaturedImage || (() => console.warn("Main image functionality not available")),
    handleToggleFeaturedImage: handleToggleFeaturedImage || (() => console.warn("Featured image functionality not available")),
    handleRemoveAreaPhoto: handleRemoveAreaPhoto || ((areaId: string, imageId: string) => {
      console.warn("Area photo removal functionality not available");
    }),
    onFetchLocationData,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    setPendingChanges,
    featuredImage: formState.featuredImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate,
    onFeatureImageToggle,
    onSetMainImage,
    isSaving
  };

  const tabProps = {
    activeTab,
    property,
    formState,
    agentInfo,
    templateInfo,
    isUpdating,
    handlers
  };

  console.log("PropertyTabContents - Active tab:", activeTab);

  return renderTabContent(tabProps);
}
