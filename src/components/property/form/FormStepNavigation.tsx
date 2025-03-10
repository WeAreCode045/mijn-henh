
import React from "react";
import { Button } from "@/components/ui/button";
import { steps, FormStep } from "./formSteps";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormStepNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

export function FormStepNavigation({
  currentStep,
  onStepClick,
  handleNext,
  handlePrevious
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
      
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button
          type="button"
          variant="default"
          onClick={handleNext}
          disabled={currentStep === steps.length}
          className="flex items-center"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
