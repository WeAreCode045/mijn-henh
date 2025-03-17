
import React from "react";
import { PropertyFormData } from "@/types/property";
import { FormStepActions } from "./steps/FormStepActions";
import { FormStepNavigation } from "./FormStepNavigation";

interface PropertyStepFormProps {
  formData: PropertyFormData;
  step: number;
  onStepChange: (step: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export function PropertyStepForm({
  formData,
  step,
  onStepChange,
  onFieldChange,
  onSubmit,
  isSubmitting = false,
  children
}: PropertyStepFormProps) {
  return (
    <form className="space-y-6">
      <FormStepNavigation
        currentStep={step}
        onStepClick={onStepChange}
      />
      
      <div className="mt-6">
        {children}
      </div>

      {onSubmit && (
        <FormStepActions
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitText="Save Property"
        />
      )}
    </form>
  );
}
