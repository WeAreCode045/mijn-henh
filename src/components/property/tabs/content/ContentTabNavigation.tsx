
import React from "react";
import { Button } from "@/components/ui/button";
import { steps } from "../../form/formSteps";
import { Check, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onSave?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export function ContentTabNavigation({
  currentStep,
  onStepClick,
  onSave,
  isSaving = false,
  lastSaved = null,
}: ContentTabNavigationProps) {
  const handleStepClick = (e: React.MouseEvent, step: number) => {
    e.preventDefault(); // Prevent form submission
    onStepClick(step);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (onSave) onSave();
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
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved: {format(lastSaved, "HH:mm:ss")}
              </span>
            )}
            <Button
              type="button"
              onClick={handleSave}
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
