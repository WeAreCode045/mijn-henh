
import { PropertyData, PropertyFormData } from "@/types/property";

export interface PropertyFormManagerProps {
  property: PropertyData;
  children: (props: PropertyFormManagerChildrenProps) => React.ReactNode;
}

export interface PropertyFormManagerChildrenProps {
  formState: PropertyFormData;
  handleFieldChange: (field: keyof PropertyData, value: any) => void;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleSaveTemplate: (templateId: string) => Promise<void>;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, description: string) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: any, value: any) => void;
  handleAreaImageRemove: (areaId: string, imageId: string) => void;
  handleAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isUploading: boolean;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto: (areaId: string, imageId: string) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan: (index: number) => void;
  isUploadingFloorplan: boolean;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleFeaturedImage: (url: string) => void;
  onSubmit: () => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  propertyWithRequiredProps: PropertyData;
  lastSaved: Date | null;
  isSaving: boolean;
  setPendingChanges: (pending: boolean) => void;
  // Location-related handlers
  onFetchLocationData: () => Promise<any>;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onFetchNearbyCities: () => Promise<any>;
  onGenerateLocationDescription: () => Promise<any>;
  onGenerateMap: () => Promise<any>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingLocationData: boolean;
  isGeneratingMap: boolean;
  // For media components
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  // For media components
  onFeatureImageToggle?: (url: string) => void;
  onSetMainImage?: (url: string) => void;
  // Aliases for backward compatibility
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  images: any[];
}
