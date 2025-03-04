
import { PropertyFormData } from "@/types/property";

export interface PropertyTabProps {
  activeTab: string;
  property: {
    id: string;
    title: string;
    object_id?: string;
    agent_id?: string;
    featuredImage?: string | null;
    gridImages?: string[];
    images: any[];
    virtualTourUrl?: string;
    youtubeUrl?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
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
    onAreaImageUpload: (areaId: string, files: FileList) => void;
    onAreaImageRemove: (areaId: string, imageId: string) => void;
    onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: (index: number) => void;
    isUploading: boolean;
    handleSetFeaturedImage: (url: string | null) => void;
    handleToggleGridImage: (url: string) => void;
    onAddTechnicalItem: (e?: React.MouseEvent) => void;
    onRemoveTechnicalItem?: (id: string) => void;
    onUpdateTechnicalItem?: (id: string, field: any, value: any) => void;
    currentStep: number;
    handleStepClick: (step: number) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    onSubmit: () => void;
    formState: PropertyFormData;
  };
}
