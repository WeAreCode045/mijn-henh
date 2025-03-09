
import React from "react";
import { PropertyFormData } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { GeneralInfoStep } from "@/components/property/form/steps/general-info/GeneralInfoStep";
import { FeaturesStep } from "@/components/property/form/steps/FeaturesStep";
import { AreasStep } from "@/components/property/form/steps/AreasStep";
import { LocationStep } from "@/components/property/form/steps/LocationStep";
import { ImagesStep } from "@/components/property/form/steps/ImagesStep";

interface PropertyStepContentProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (id: string) => void;
  onUpdateFeature?: (id: string, description: string) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: any, value: any) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  onFetchLocationData?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  isUploadingFloorplan?: boolean;
}

export function PropertyStepContent({
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
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onFetchLocationData,
  onGenerateLocationDescription,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges,
  handleImageUpload,
  handleRemoveImage,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  handleAreaPhotosUpload,
  handleRemoveAreaPhoto,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading,
  isUploadingFloorplan
}: PropertyStepContentProps) {
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GeneralInfoStep
            formData={formData}
            onFieldChange={onFieldChange}
            handleSetFeaturedImage={handleSetFeaturedImage}
            handleToggleFeaturedImage={handleToggleFeaturedImage}
            setPendingChanges={setPendingChanges}
          />
        );
      case 1:
        return (
          <LocationStep
            formData={formData}
            onFieldChange={onFieldChange}
            onFetchLocationData={onFetchLocationData}
            onGenerateLocationDescription={onGenerateLocationDescription}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            setPendingChanges={setPendingChanges}
          />
        );
      case 2:
        return (
          <FeaturesStep
            formData={formData}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
            onFieldChange={onFieldChange}
            setPendingChanges={setPendingChanges}
          />
        );
      case 3:
        return (
          <AreasStep
            formData={formData}
            onAddArea={onAddArea}
            onRemoveArea={onRemoveArea}
            onUpdateArea={onUpdateArea}
            onAreaImageUpload={onAreaImageUpload}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
            isUploading={isUploading}
            setPendingChanges={setPendingChanges}
            handleAreaPhotosUpload={handleAreaPhotosUpload}
            handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          />
        );
      case 4:
        return (
          <ImagesStep
            formData={formData}
            onFieldChange={onFieldChange}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            handleFloorplanUpload={handleFloorplanUpload}
            handleRemoveFloorplan={handleRemoveFloorplan}
            handleAreaPhotosUpload={handleAreaPhotosUpload}
            handleRemoveAreaPhoto={handleRemoveAreaPhoto}
            handleSetFeaturedImage={handleSetFeaturedImage}
            handleToggleFeaturedImage={handleToggleFeaturedImage}
            isUploading={isUploading}
            isUploadingFloorplan={isUploadingFloorplan}
            setPendingChanges={setPendingChanges}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="space-y-6">
      <FormStepNavigation
        currentStep={currentStep}
        onStepClick={handleStepClick}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
      <div className="mt-6">
        {renderStep()}
      </div>
    </div>
  );
}
