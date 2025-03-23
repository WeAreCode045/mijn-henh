
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
  step: number; // Added explicit step property
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
  handleNext?: () => void;  // Changed to match function signature with no parameters
  handlePrevious?: () => void;  // Changed to match function signature with no parameters
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
  hideNavigation?: boolean; // Add property to hide navigation if needed
}

export function PropertyStepContent({
  formData,
  step, // Use the step property
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
  hideNavigation = false,
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
            onFetchCategoryPlaces={onFetchCategoryPlaces}
            onFetchNearbyCities={onFetchNearbyCities}
            onGenerateLocationDescription={onGenerateLocationDescription}
            onGenerateMap={onGenerateMap}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            isGeneratingMap={isGeneratingMap}
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
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
            onAreaImageUpload={onAreaImageUpload}
            setPendingChanges={setPendingChanges}
            isUploading={isUploading}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Internal handlers for navigation that call the props only when they exist
  const handlePreviousClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (handlePrevious) handlePrevious();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (handleNext) handleNext();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <div className="space-y-6">
      {!hideNavigation && (
        <FormStepNavigation
          currentStep={currentStep}
          onStepClick={handleStepClick}
          onSave={handleSubmit}
          isSaving={isSaving}
        />
      )}
      
      <div className="mt-6">
        {renderStep()}
      </div>
      
      {/* Navigation Buttons - only show if navigation isn't hidden */}
      {!hideNavigation && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePreviousClick}
            disabled={currentStep === 0}
            type="button" // Explicitly set as button type
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNextClick}
            disabled={currentStep === 3}
            type="button" // Explicitly set as button type
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
