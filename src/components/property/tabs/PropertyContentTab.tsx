
import { useState, useEffect } from "react";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";
import { steps } from "@/components/property/form/formSteps";

interface PropertyContentTabProps {
  formData: PropertyFormData;
  currentStep?: number;
  handleStepClick?: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onSubmit?: () => void;
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
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  isUpdateMode: boolean;
  isUploading?: boolean;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
}

export function PropertyContentTab({
  formData,
  currentStep: externalCurrentStep,
  handleStepClick: externalHandleStepClick,
  handleNext: externalHandleNext,
  handlePrevious: externalHandlePrevious,
  onSubmit: externalOnSubmit,
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
  handleMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  isUpdateMode,
  isUploading,
  handleSetFeaturedImage,
  handleToggleGridImage,
}: PropertyContentTabProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;
  
  console.log("PropertyContentTab - Current step:", currentStep);
  
  const safeAddTechnicalItem = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onAddTechnicalItem) {
      console.log("Adding technical item");
      onAddTechnicalItem();
    }
  };
  
  const safeRemoveTechnicalItem = (id: string) => {
    if (onRemoveTechnicalItem) {
      console.log("Removing technical item", id);
      onRemoveTechnicalItem(id);
    }
  };
  
  const handleStepClick = (step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    if (externalHandleStepClick) {
      externalHandleStepClick(step);
    } else {
      setInternalCurrentStep(step);
    }
  };
  
  const handleNext = () => {
    console.log("Next clicked in PropertyContentTab");
    if (externalHandleNext) {
      externalHandleNext();
    } else if (internalCurrentStep < steps.length) {
      setInternalCurrentStep(internalCurrentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked in PropertyContentTab");
    if (externalHandlePrevious) {
      externalHandlePrevious();
    } else if (internalCurrentStep > 1) {
      setInternalCurrentStep(internalCurrentStep - 1);
    }
  };
  
  const onSubmit = () => {
    console.log("Submit clicked in PropertyContentTab");
    if (externalOnSubmit) {
      externalOnSubmit();
    } else {
      console.log("Form submitted in PropertyContentTab");
    }
  };

  return (
    <div className="space-y-4">
      <FormStepNavigation
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={onSubmit}
        isUpdateMode={isUpdateMode}
      />
      <PropertyFormContent
        step={currentStep}
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
        handleMapImageDelete={handleMapImageDelete}
        onFetchLocationData={onFetchLocationData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        onAddTechnicalItem={safeAddTechnicalItem}
        onRemoveTechnicalItem={safeRemoveTechnicalItem}
        onUpdateTechnicalItem={onUpdateTechnicalItem}
        handleSetFeaturedImage={handleSetFeaturedImage}
        handleToggleGridImage={handleToggleGridImage}
        isUploading={isUploading}
      />
    </div>
  );
}
