
import React from "react";
import { Button } from "@/components/ui/button";
import { steps } from "./formSteps";

interface FormStepNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function FormStepNavigation({
  currentStep,
  onStepClick,
}: FormStepNavigationProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <Button
              key={step.id}
              variant={currentStep === step.id ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e.preventDefault(); // Prevent default form submission behavior
                onStepClick(step.id);
              }}
              type="button" // Explicitly set as button type to prevent form submission
              className="flex items-center gap-1"
            >
              {step.icon}
              <span>{step.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
