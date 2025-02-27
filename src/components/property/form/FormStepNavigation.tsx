
import { Button } from "@/components/ui/button";
import { FormStep } from "./formSteps";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormStepNavigationProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isUpdateMode?: boolean;
}

export function FormStepNavigation({
  steps,
  currentStep,
  onStepClick,
  onPrevious,
  onNext,
  onSubmit,
  isUpdateMode
}: FormStepNavigationProps) {
  // Prevent event propagation to avoid unwanted form submissions
  const handleStepClick = (e: React.MouseEvent, stepId: number) => {
    e.preventDefault();
    e.stopPropagation();
    onStepClick(stepId);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Next button clicked, currentStep:", currentStep);
    onNext();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPrevious();
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{steps[currentStep - 1]?.title || 'Property Information'}</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={(e) => handleStepClick(e, step.id)}
              type="button"
              className={`flex flex-col items-center gap-2 ${
                step.id === currentStep
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary transition-colors"
              } cursor-pointer`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.id === currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-primary/10 transition-colors"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs whitespace-nowrap">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === steps.length ? (
          <Button type="submit" onClick={onSubmit}>
            Save Property
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </>
  );
}
