
import { PropertyFormData } from "@/types/property";

export interface PropertyTabProps {
  activeTab: string;
  property: {
    id: string;
    title: string;
    object_id?: string;
    agent_id?: string;
    featuredImage?: string | null;
    featuredImages?: string[];
    images: any[];
    floorplans?: any[];
    virtualTourUrl?: string;
    youtubeUrl?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    floorplanEmbedScript?: string;
    price?: string;
    address?: string;
    bedrooms?: string;
    bathrooms?: string;
    sqft?: string;
    description?: string;
  };
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  handlers: {
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
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: (index: number) => void;
    isUploading: boolean;
    handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>; // Add the missing handler
    handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFloorplan: (index: number) => void;
    isUploadingFloorplan: boolean;
    handleSetFeaturedImage: (url: string | null) => void;
    handleToggleFeaturedImage: (url: string) => void;
    currentStep: number;
    handleStepClick: (step: number) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    onSubmit: () => void;
    // Optional handlers
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    // Use the standardized signature
    handleRemoveAreaPhoto: (areaId: string, imageId: string) => void;
    // Add the missing setPendingChanges property
    setPendingChanges?: (pending: boolean) => void;
    // Add featuredImageUrl for backward compatibility
    featuredImageUrl?: string;
    featuredImage?: string | null; // Add this for compatibility
  };
}
