
import React from "react";
import { PropertyFormData } from "@/types/property";
import { FeaturesStep } from "@/components/property/form/steps/FeaturesStep";
import { SaveButton } from "./SaveButton";

interface FeaturesPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function FeaturesPage({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onSubmit,
  isSaving,
  setPendingChanges
}: FeaturesPageProps) {
  const handleSave = () => {
    if (setPendingChanges) setPendingChanges(true);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <FeaturesStep
        formData={formData}
        onAddFeature={onAddFeature}
        onRemoveFeature={onRemoveFeature}
        onUpdateFeature={onUpdateFeature}
        onFieldChange={onFieldChange}
        setPendingChanges={setPendingChanges}
      />
      
      <SaveButton onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
