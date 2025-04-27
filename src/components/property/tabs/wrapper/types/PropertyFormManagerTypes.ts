
import { PropertyData, PropertyFormData } from '@/types/property';

export interface PropertyFormManagerProps {
  property: PropertyData;
  isArchived?: boolean;
  children: (props: PropertyFormManagerChildrenProps) => React.ReactNode;
}

export interface PropertyFormManagerChildrenProps {
  formState: PropertyFormData;
  formData: PropertyFormData;
  handleFieldChange: (field: string, value: any) => void;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, description: string) => void;
  addArea: () => void;
  removeArea: (id: string) => void;
  updateArea: (id: string, field: any, value: any) => void;
  handleAreaImageRemove: (areaId: string, imageId: string) => void;
  handleAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  handleImageUpload: (files: FileList) => Promise<void>;
  handleRemoveImage: (imageUrl: string) => void;
  isUploading: boolean;
  handleAreaPhotosUpload: (files: FileList) => Promise<void>;
  handleRemoveAreaPhoto: (areaId: string, imageId: string) => void;
  handleFloorplanUpload: (files: FileList) => Promise<void>;
  handleRemoveFloorplan: (floorplanId: string) => void;
  isUploadingFloorplan: boolean;
  handleSetFeaturedImage: (imageUrl: string) => void;
  handleToggleFeaturedImage: (imageUrl: string) => void;
  onSubmit: () => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  propertyWithRequiredProps: PropertyData;
  lastSaved?: Date;
  isSaving: boolean;
  isSubmitting?: boolean;
  onSave?: () => Promise<void>;
  setPendingChanges: (pendingChanges: boolean) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  handleVirtualTourUpdate?: (url: string) => void;
  handleYoutubeUrlUpdate?: (url: string) => void;
  handleFloorplanEmbedScriptUpdate?: (script: string) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (id: string) => void;
  onUpdateFeature?: (id: string, description: string) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: any, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  images: string[];
  settings?: any;
}
