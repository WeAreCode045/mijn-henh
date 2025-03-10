
import { PropertyData, PropertyFormData } from "@/types/property";

export interface PropertyFormManagerProps {
  property: PropertyData;
  children: (props: PropertyFormManagerChildrenProps) => React.ReactNode;
}

export interface PropertyFormManagerChildrenProps {
  formState: PropertyFormData;
  handleFieldChange: (field: keyof PropertyData, value: any) => void;
  handleSaveObjectId: (objectId: string) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
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
  handleNext: () => void;
  handlePrevious: () => void;
  propertyWithRequiredProps: PropertyData;
  lastSaved: Date | null;
  isSaving: boolean;
  setPendingChanges: (pending: boolean) => void;
  // Add these new handlers
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  // For media components
  onFeatureImageToggle?: (url: string) => void;
  onSetMainImage?: (url: string) => void;
}
