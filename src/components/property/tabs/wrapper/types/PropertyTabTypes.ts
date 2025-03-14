
import { PropertyData, PropertyFormData, PropertyCity, PropertyNearbyPlace } from "@/types/property";

export interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo: { id: string; name: string };
  templateInfo: { id: string; name: string };
  isUpdating?: boolean;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData: () => Promise<void>;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onFetchNearbyCities: () => Promise<any>;
  onGenerateLocationDescription: () => Promise<void>;
  onGenerateMap: () => Promise<void>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingLocationData: boolean;
  isGeneratingMap: boolean;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  setPendingChanges: (pending: boolean) => void;
  isSaving?: boolean;
}

export interface PropertyFormManagerChildrenProps {
  formState: PropertyFormData;
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSaveObjectId: (objectId: string) => void;
  handleSaveAgent: (agentId: string) => void;
  handleSaveTemplate: (templateId: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  onFetchLocationData: () => Promise<void>;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onFetchNearbyCities: () => Promise<any>;
  onGenerateLocationDescription: () => Promise<void>;
  onGenerateMap: () => Promise<void>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingLocationData: boolean;
  isGeneratingMap: boolean;
  onSubmit: () => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  lastSaved: Date | null;
  isSaving: boolean;
  setPendingChanges: (pending: boolean) => void;
}

export interface PropertyTabProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo: { id: string; name: string };
  templateInfo: { id: string; name: string };
  isUpdating: boolean;
  handlers: {
    onSave: () => void;
    onDelete: () => Promise<void>;
    handleSaveObjectId: (objectId: string) => void;
    handleSaveAgent: (agentId: string) => void;
    handleSaveTemplate: (templateId: string) => void;
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
    onFetchLocationData: () => Promise<void>;
    onFetchCategoryPlaces: (category: string) => Promise<any>;
    onFetchNearbyCities: () => Promise<any>;
    onGenerateLocationDescription: () => Promise<void>;
    onGenerateMap: () => Promise<void>;
    onRemoveNearbyPlace: (index: number) => void;
    isLoadingLocationData: boolean;
    isGeneratingMap: boolean;
    currentStep: number;
    handleStepClick: (step: number) => void;
    setPendingChanges: (pending: boolean) => void;
    isSaving: boolean;
  }
}
