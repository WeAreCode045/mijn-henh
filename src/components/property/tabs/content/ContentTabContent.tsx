
import React from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { PropertyStepWizard } from '../../form/PropertyStepWizard';

interface ContentTabContentProps {
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
  hideNavigation?: boolean;
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
  return (
    <div className="mt-4">
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
        hideNavigation={hideNavigation}
      />
    </div>
  );
}
