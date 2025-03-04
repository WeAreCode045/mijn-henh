import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { 
  renderDashboardTab, 
  renderContentTab, 
  renderMediaTab,
  renderCommunicationsTab
} from "../content/TabContentRenderers";

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
    virtualTourUrl?: string;
    youtubeUrl?: string;
    notes?: string;
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
  isUploading?: boolean;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
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
  // Legacy props (for backward compatibility)
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleCoverImage?: (url: string) => void;
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
  isUploading,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleUpdateFloorplan,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onSubmit,
  handleSetFeaturedImage,
  handleToggleCoverImage
}: PropertyTabContentsProps) {
  const safeAddTechnicalItem = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onAddTechnicalItem) {
      console.log("PropertyTabContents - Adding technical item");
      onAddTechnicalItem();
    }
  };

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
    onAreaImageUpload,
    onAreaImageRemove,
    onAreaImagesSelect,
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    onAddTechnicalItem: safeAddTechnicalItem,
    onRemoveTechnicalItem,
    onUpdateTechnicalItem,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    onSubmit,
    formState,
    handleSetFeaturedImage: handleSetFeaturedImage || (() => console.warn("Featured image functionality not available")),
    handleToggleCoverImage: handleToggleCoverImage || (() => console.warn("Cover image functionality not available"))
  };

  const tabProps = {
    activeTab,
    property: {
      ...property,
      featuredImage: formState.featuredImage || "",
      coverImages: formState.coverImages || []
    },
    formState,
    agentInfo,
    templateInfo,
    isUpdating,
    handlers
  };

  console.log("PropertyTabContents - Active tab:", activeTab);

  return (
    <>
      {renderDashboardTab(tabProps)}
      {renderContentTab(tabProps)}
      {renderMediaTab(tabProps)}
      {renderCommunicationsTab(tabProps)}
    </>
  );
}
