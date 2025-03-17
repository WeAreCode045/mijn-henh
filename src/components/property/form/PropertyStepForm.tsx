
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { FormStepNavigation } from "./FormStepNavigation";
import { steps } from "./formSteps";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

export interface PropertyStepFormProps {
  formData: PropertyFormData;
  step: number;
  onStepChange: (step: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  children?: React.ReactNode;
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
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      onStepChange(step + 1);
    }
  };
  
  const handlePrevious = () => {
    if (step > 0) {
      onStepChange(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };
  
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormStepNavigation
        currentStep={step}
        onStepClick={onStepChange}
      />
      
      <div className="mt-6 space-y-4">
        {children}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 0 || isSubmitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={step === steps.length - 1 || isSubmitting}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
