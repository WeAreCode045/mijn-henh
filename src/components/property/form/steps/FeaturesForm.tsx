
import React from "react";
import { PropertyStepForm } from "../PropertyStepForm";
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturesFormProps {
  formData: PropertyFormData;
  step: number;
  onStepChange: (step: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function FeaturesForm({
  formData,
  step,
  onStepChange,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onSubmit,
  isSubmitting = false
}: FeaturesFormProps) {
  return (
    <PropertyStepForm
      formData={formData}
      step={step}
      onStepChange={onStepChange}
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Card>
        <CardContent className="pt-6">
          <PropertyFeatures 
            features={formData.features || []}
            onAdd={onAddFeature}
            onRemove={onRemoveFeature}
            onUpdate={onUpdateFeature}
          />
        </CardContent>
      </Card>
    </PropertyStepForm>
  );
}
