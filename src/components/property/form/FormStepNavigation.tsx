
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
    <div className="flex flex-wrap gap-2">
      {steps.map((step) => (
        <Button
          key={step.id}
          variant={currentStep === step.id ? "default" : "outline"}
          size="sm"
          onClick={() => onStepClick(step.id)}
          className="flex items-center gap-1"
        >
          {step.icon}
          <span>{step.title}</span>
        </Button>
      ))}
    </div>
  );
}
