
import React from "react";
import { Button } from "@/components/ui/button";
import { steps } from "./formSteps";
import { Check, Loader2 } from "lucide-react";

interface FormStepNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaving?: boolean;
}

export function FormStepNavigation({
  currentStep,
  onStepClick,
  onSave,
  isSaving = false,
}: FormStepNavigationProps) {
  const handleStepClick = (e: React.MouseEvent, stepId: number) => {
    e.preventDefault(); // Prevent form submission
    onStepClick(stepId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <Button
              key={step.id}
              variant={currentStep === step.id ? "default" : "outline"}
              size="sm"
              onClick={(e) => handleStepClick(e, step.id)}
              type="button" 
              className="flex items-center gap-1"
            >
              {step.icon}
              <span>{step.title}</span>
            </Button>
          ))}
        </div>
        
        {onSave && (
          <div>
            <Button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
