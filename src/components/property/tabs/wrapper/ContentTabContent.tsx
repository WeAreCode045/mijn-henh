
import { PropertyContentTab } from "../PropertyContentTab";
import { PropertyFormData } from "@/types/property";

interface ContentTabContentProps {
  formData: PropertyFormData;
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
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;  // Updated to match correct signature
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan?: (index: number) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  onSubmit: () => void;
  isUploading?: boolean;
  isUploadingFloorplan?: boolean;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  onAddTechnicalItem?: () => void;
}

export function ContentTabContent({
  formData,
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
  handleAreaPhotosUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onSubmit,
  isUploading,
  isUploadingFloorplan,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  onAddTechnicalItem
}: ContentTabContentProps) {
  return (
    <PropertyContentTab 
      formData={formData}
      onFieldChange={onFieldChange}
      onAddFeature={onAddFeature}
      onRemoveFeature={onRemoveFeature}
      onUpdateFeature={onUpdateFeature}
      onAddArea={onAddArea}
      onRemoveArea={onRemoveArea}
      onUpdateArea={onUpdateArea}
      onAreaImageUpload={onAreaImageUpload}
      onAreaImageRemove={onAreaImageRemove}
      onAreaImagesSelect={onAreaImagesSelect}
      handleImageUpload={handleImageUpload}
      handleAreaPhotosUpload={handleAreaPhotosUpload}
      handleRemoveImage={handleRemoveImage}
      handleRemoveAreaPhoto={handleRemoveAreaPhoto}
      handleFloorplanUpload={handleFloorplanUpload}
      handleRemoveFloorplan={handleRemoveFloorplan}
      isUpdateMode={true}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      onSubmit={onSubmit}
      isUploading={isUploading}
      isUploadingFloorplan={isUploadingFloorplan}
      handleSetFeaturedImage={handleSetFeaturedImage}
      handleToggleFeaturedImage={handleToggleFeaturedImage}
      onAddTechnicalItem={onAddTechnicalItem}
    />
  );
}
