
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";
import { steps } from "@/components/property/form/formSteps";

interface PropertyContentTabProps {
  formData: PropertyFormData;
  currentStep?: number;
  handleStepClick?: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onSubmit?: () => void; // Changed from (e: React.FormEvent) => void to match FormStepNavigation
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
  handleSetFeaturedImage: (url: string) => void;
  handleToggleGridImage: (url: string) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isUpdateMode: boolean;
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
  handleSetFeaturedImage,
  handleToggleGridImage,
  handleMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace,
  isUpdateMode,
}: PropertyContentTabProps) {
  // Initialize with provided step or default to 1
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  
  // Use external state if provided, otherwise use internal state
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;
  
  // Internal handlers if external ones aren't provided
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
  
  // Updated onSubmit implementation to match the expected signature (no parameters)
  const onSubmit = () => {
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
        handleSetFeaturedImage={handleSetFeaturedImage}
        handleToggleGridImage={handleToggleGridImage}
        handleMapImageDelete={handleMapImageDelete}
        onFetchLocationData={onFetchLocationData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
      />
    </div>
  );
}
