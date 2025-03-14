
import React from "react";
import { Button } from "@/components/ui/button";
import { steps, FormStep } from "./formSteps";
import { Save } from "lucide-react";

interface FormStepNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function FormStepNavigation({
  currentStep,
  onStepClick,
  onSave,
  isSaving = false
}: FormStepNavigationProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <Button
            key={step.id}
            type="button"
            variant={currentStep === step.id ? "default" : "outline"}
            className="flex-1"
            onClick={() => onStepClick(step.id)}
          >
            <span className="flex items-center">
              {step.icon}
              <span className="ml-2 hidden sm:inline">{step.title}</span>
            </span>
          </Button>
        ))}
      </div>
      
      {onSave && (
        <div className="flex justify-center mt-4">
          <Button
            type="button"
            variant="default"
            onClick={onSave}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
