
import { PropertyContentTab } from "../PropertyContentTab";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";

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
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  onSubmit: () => void;
  isUploading?: boolean;
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
  handleFloorplanUpload,
  handleRemoveImage,
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
  isUploading
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
      handleFloorplanUpload={handleFloorplanUpload}
      handleRemoveImage={handleRemoveImage}
      handleRemoveAreaPhoto={handleRemoveAreaPhoto}
      handleRemoveFloorplan={handleRemoveFloorplan}
      handleUpdateFloorplan={handleUpdateFloorplan}
      onAddTechnicalItem={onAddTechnicalItem}
      onRemoveTechnicalItem={onRemoveTechnicalItem}
      onUpdateTechnicalItem={onUpdateTechnicalItem}
      isUpdateMode={true}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      onSubmit={onSubmit}
      isUploading={isUploading}
    />
  );
}
