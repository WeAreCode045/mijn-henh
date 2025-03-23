
import React from "react";
import { PropertyFormData } from "@/types/property";
import { GeneralInfoStep } from "@/components/property/form/steps/general-info/GeneralInfoStep";
import { SaveButton } from "./SaveButton";

interface GeneralPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onSubmit: () => void;
  isSaving: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function GeneralPage({
  formData,
  onFieldChange,
  onSubmit,
  isSaving,
  setPendingChanges
}: GeneralPageProps) {
  const handleSave = () => {
    if (setPendingChanges) setPendingChanges(true);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <GeneralInfoStep
        formData={formData}
        onFieldChange={onFieldChange}
        setPendingChanges={setPendingChanges}
      />
      
      <SaveButton onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
