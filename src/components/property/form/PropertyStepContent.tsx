
import React from "react";
import { PropertyFormData } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { GeneralInfoStep } from "@/components/property/form/steps/general-info/GeneralInfoStep";
import { FeaturesStep } from "@/components/property/form/steps/FeaturesStep";
import { AreasStep } from "@/components/property/form/steps/AreasStep";
import { LocationStep } from "@/components/property/form/steps/LocationStep";

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
  isUploading?: boolean;
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
  isUploading,
}: PropertyStepContentProps) {
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GeneralInfoStep
            formData={formData}
            onFieldChange={onFieldChange}
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
