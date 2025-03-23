
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
  onSubmit?: () => void; 
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
  console.log("PropertyStepContent rendering with currentStep:", currentStep);
  console.log("FormData structure:", Object.keys(formData).join(", "));
  console.log("onFieldChange is defined:", !!onFieldChange);
  
  // Define fallback handlers to prevent runtime errors
  const safeOnFieldChange = (field: keyof PropertyFormData, value: any) => {
    console.log(`PropertyStepContent safeOnFieldChange called: ${String(field)} = `, value);
    if (onFieldChange) {
      onFieldChange(field, value);
    } else {
      console.warn(`Fallback onFieldChange called with: ${String(field)}`, value);
    }
  };
  
  const safeSetPendingChanges = (value: boolean) => {
    console.log(`PropertyStepContent setPendingChanges called: ${value}`);
    if (setPendingChanges) {
      setPendingChanges(value);
    } else {
      console.warn("Fallback setPendingChanges called");
    }
  };
  
  // Render the appropriate step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GeneralInfoStep
            formData={formData}
            onFieldChange={safeOnFieldChange}
            setPendingChanges={safeSetPendingChanges}
            isReadOnly={isReadOnly}
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
            isReadOnly={isReadOnly}
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
            isReadOnly={isReadOnly}
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
            isReadOnly={isReadOnly}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Handle save button click
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("Save button clicked");
    if (onSubmit) {
      onSubmit();
    } else {
      console.warn("onSubmit not provided to PropertyStepContent");
    }
  };

  // Handle previous button click
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("Previous button clicked");
    if (handlePrevious) {
      handlePrevious();
    } else {
      console.warn("handlePrevious not provided to PropertyStepContent");
    }
  };

  // Handle next button click
  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("Next button clicked");
    if (handleNext) {
      handleNext();
    } else {
      console.warn("handleNext not provided to PropertyStepContent");
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
