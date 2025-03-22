
import { PropertyData, PropertyFormData } from "@/types/property";

export interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  isUpdating?: boolean;
  isArchived?: boolean;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleSaveTemplate: (templateId: string) => Promise<void>;
  handleGeneratePDF: () => void;
  handleWebView: (e: React.MouseEvent) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onUpdateFeature: (index: number, value: string) => void;
  onAddArea: () => void;
  onRemoveArea: (index: number) => void;
  onUpdateArea: (index: number, field: string, value: any) => void;
  onAreaImageRemove: (areaIndex: number, imageIndex: number) => void;
  onAreaImagesSelect: (areaIndex: number, files: FileList) => void;
  onAreaImageUpload: (areaIndex: number, files: FileList) => void;
  onFetchLocationData: () => Promise<void>;
  onGenerateLocationDescription: () => Promise<void>;
  onGenerateMap: () => Promise<void>;
  onRemoveNearbyPlace: (placeId: string) => void;
  isLoadingLocationData: boolean;
  isGeneratingMap: boolean;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onFetchNearbyCities: () => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isUploading: boolean;
  handleAreaPhotosUpload: (areaIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto: (areaIndex: number, photoIndex: number) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan: (index: number) => void;
  isUploadingFloorplan: boolean;
  handleSetFeaturedImage: (index: number) => void;
  handleToggleFeaturedImage: (index: number) => void;
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  onSubmit: () => void;
  setPendingChanges: (value: boolean) => void;
  isSaving?: boolean;
}

export interface TabContentRenderProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  isUpdating?: boolean;
  isArchived?: boolean;
  handlers: {
    onSave?: () => void;
    onDelete?: () => Promise<void>;
    handleSaveObjectId: (objectId: string) => Promise<void>;
    handleSaveAgent: (agentId: string) => Promise<void>;
    handleSaveTemplate: (templateId: string) => Promise<void>;
    handleGeneratePDF: () => void;
    handleWebView: (e: React.MouseEvent) => void;
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (index: number) => void;
    onUpdateFeature: (index: number, value: string) => void;
    onAddArea: () => void;
    onRemoveArea: (index: number) => void;
    onUpdateArea: (index: number, field: string, value: any) => void;
    onAreaImageRemove: (areaIndex: number, imageIndex: number) => void;
    onAreaImagesSelect: (areaIndex: number, files: FileList) => void;
    handleAreaImageUpload: (areaIndex: number, files: FileList) => void;
    onFetchLocationData: () => Promise<void>;
    onGenerateLocationDescription: () => Promise<void>;
    onGenerateMap: () => Promise<void>;
    onRemoveNearbyPlace: (placeId: string) => void;
    isLoadingLocationData: boolean;
    isGeneratingMap: boolean;
    onFetchCategoryPlaces: (category: string) => Promise<any>;
    onFetchNearbyCities: () => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    setPendingChanges: (value: boolean) => void;
    isSaving?: boolean;
  };
}
