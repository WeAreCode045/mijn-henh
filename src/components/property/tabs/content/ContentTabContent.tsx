
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyStepWizard } from "../../form/PropertyStepWizard";

interface ContentTabContentProps {
  property: PropertyData; // Changed from formState to property
  formState: PropertyFormData; // Added this property
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  onSubmit: () => void;
  isReadOnly?: boolean;
  hideNavigation?: boolean; // Add this prop to hide navigation
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
  isReadOnly = false,
  hideNavigation = false
}: ContentTabContentProps) {
  // Create adapter functions to match the expected types in PropertyStepWizard
  const adaptedRemoveFeature = (id: string) => {
    onRemoveFeature(id);
  };
  
  const adaptedUpdateFeature = (id: string, description: string) => {
    onUpdateFeature(id, description);
  };

  // Explicit handler for onSubmit to ensure it's called properly
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log("Submit triggered in ContentTabContent");
    onSubmit();
  };

  return (
    <PropertyStepWizard 
      property={property}
      formState={formState}
      onFieldChange={onFieldChange}
      onAddFeature={onAddFeature}
      onRemoveFeature={adaptedRemoveFeature}
      onUpdateFeature={adaptedUpdateFeature}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      onSubmit={handleSubmit}
      isReadOnly={isReadOnly}
      hideNavigation={hideNavigation}
    />
  );
}
