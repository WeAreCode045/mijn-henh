
import React from "react";
import { PropertyFormData } from "@/types/property";
import { FormStepActions } from "./steps/FormStepActions";
import { FormStepNavigation } from "./FormStepNavigation";
import { Form } from "@/components/ui/form";
import { useForm, FormProvider } from "react-hook-form";

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
  // Initialize react-hook-form to provide the context
  const formMethods = useForm({
    defaultValues: formData,
    // Set values and mode
    values: formData,
    mode: "onChange"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  // Use form provider to make form context available to all child components
  return (
    <FormProvider {...formMethods}>
      <form className="space-y-6" onSubmit={handleSubmit}>
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
    </FormProvider>
  );
}
