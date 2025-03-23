
import React from "react";
import { PropertyFormData } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { GeneralInfoStep } from "@/components/property/form/steps/general-info/GeneralInfoStep";
import { FeaturesStep } from "@/components/property/form/steps/FeaturesStep";
import { AreasStep } from "@/components/property/form/steps/AreasStep";
import { LocationStep } from "@/components/property/form/steps/LocationStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PropertyStepContentProps {
  formData: PropertyFormData;
  step?: number;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (id: string) => void;
  onUpdateFeature?: (id: string, description: string) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: any, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  isUploading?: boolean;
  onSubmit?: (e: React.MouseEvent) => void; 
  isSaving?: boolean;
  isReadOnly?: boolean;
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
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  currentStep,
  handleStepClick,
  handleNext,
  handlePrevious,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  setPendingChanges,
  isUploading,
  onSubmit,
  isSaving,
  isReadOnly,
}: PropertyStepContentProps) {
  console.log("PropertyStepContent rendering, activeStep:", currentStep);
  
  // Make sure we have all necessary handlers before rendering steps
  const renderStep = () => {
    // Define fallback handlers to prevent runtime errors
    const safeSetPendingChanges = setPendingChanges || (() => {});
    const safeOnFieldChange = onFieldChange || (() => {});
    
    switch (currentStep) {
      case 0:
        return (
          <GeneralInfoStep
            formData={formData}
            onFieldChange={safeOnFieldChange}
            setPendingChanges={safeSetPendingChanges}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
          />
        );
      case 1:
        return (
          <LocationStep
            formData={formData}
            onFieldChange={safeOnFieldChange}
            onFetchLocationData={onFetchLocationData}
            onFetchCategoryPlaces={onFetchCategoryPlaces}
            onFetchNearbyCities={onFetchNearbyCities}
            onGenerateLocationDescription={onGenerateLocationDescription}
            onGenerateMap={onGenerateMap}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            isGeneratingMap={isGeneratingMap}
            setPendingChanges={safeSetPendingChanges}
          />
        );
      case 2:
        return (
          <FeaturesStep
            formData={formData}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
            onFieldChange={safeOnFieldChange}
            setPendingChanges={safeSetPendingChanges}
          />
        );
      case 3:
        return (
          <AreasStep
            formData={formData}
            onAddArea={onAddArea}
            onRemoveArea={onRemoveArea}
            onUpdateArea={onUpdateArea}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
            onAreaImageUpload={onAreaImageUpload}
            setPendingChanges={safeSetPendingChanges}
            isUploading={isUploading}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Ensure the save button properly triggers the onSubmit function
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (setPendingChanges) {
      setPendingChanges(true);
    }
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (handlePrevious) {
      handlePrevious();
    }
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (handleNext) {
      handleNext();
    }
  };

  return (
    <div className="space-y-6">
      <FormStepNavigation
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onSave={handleSave}
        isSaving={isSaving}
      />
      <div className="mt-6">
        {renderStep()}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0 || isReadOnly}
          type="button"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || isReadOnly}
            type="button"
            variant="secondary"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          
          <Button
            onClick={handleNextStep}
            disabled={currentStep === 3 || isReadOnly}
            type="button"
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
