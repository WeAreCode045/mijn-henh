
import { PropertyFormData } from "@/types/property";
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
    floorplans?: any[];
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
  handleRemoveFloorplan: (index: number) => void;
  // Step navigation props
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  onSubmit: () => void;
  // Main image and featured images props
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploadingFloorplan?: boolean;
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
  handleRemoveFloorplan,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onSubmit,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploadingFloorplan
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
    onAreaImageUpload,
    onAreaImageRemove,
    onAreaImagesSelect,
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    onSubmit,
    formState,
    isUploadingFloorplan,
    handleSetFeaturedImage: handleSetFeaturedImage || (() => console.warn("Main image functionality not available")),
    handleToggleFeaturedImage: handleToggleFeaturedImage || (() => console.warn("Featured image functionality not available"))
  };

  const tabProps = {
    activeTab,
    property: {
      ...property,
      featuredImage: formState.featuredImage || "",
      featuredImages: formState.featuredImages || []
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
