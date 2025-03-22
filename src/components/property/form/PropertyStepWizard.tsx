
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyStepContent } from "./PropertyStepContent";
import { FormStepNavigation } from "./FormStepNavigation";

interface PropertyStepWizardProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  onSubmit: () => void;
  isReadOnly?: boolean;
}

export function PropertyStepWizard({
  property,
  formState,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  currentStep,
  handleStepClick,
  onSubmit,
  isReadOnly = false
}: PropertyStepWizardProps) {
  return (
    <div className="space-y-6">
      <FormStepNavigation
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onSave={onSubmit}
        isSaving={false}
      />
      
      <PropertyStepContent 
        formData={formState}
        step={currentStep} // Pass currentStep as step
        onFieldChange={onFieldChange}
        onAddFeature={onAddFeature}
        onRemoveFeature={onRemoveFeature}
        onUpdateFeature={onUpdateFeature}
        currentStep={currentStep}
        handleStepClick={handleStepClick}
        handleNext={() => handleStepClick(currentStep + 1)}
        handlePrevious={() => handleStepClick(currentStep - 1)}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
