
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyStepWizard } from "../../form/PropertyStepWizard";

interface ContentTabContentProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onUpdateFeature: (index: number, value: string) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  onSubmit: () => void;
  isReadOnly?: boolean;
}

export function ContentTabContent({ 
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
}: ContentTabContentProps) {
  return (
    <PropertyStepWizard 
      property={property}
      formState={formState}
      onFieldChange={onFieldChange}
      onAddFeature={onAddFeature}
      onRemoveFeature={onRemoveFeature}
      onUpdateFeature={onUpdateFeature}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      onSubmit={onSubmit}
      isReadOnly={isReadOnly}
    />
  );
}
