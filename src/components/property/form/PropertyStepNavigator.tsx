
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

interface PropertyStepNavigatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function PropertyStepNavigator({
  currentStep,
  onStepClick,
  onSave,
  isSaving
}: PropertyStepNavigatorProps) {
  const steps = [
    { id: 0, name: "General" },
    { id: 1, name: "Location" },
    { id: 2, name: "Features" },
    { id: 3, name: "Areas" }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {index > 0 && <Separator orientation="vertical" className="h-4" />}
            <Button
              variant={currentStep === step.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onStepClick(step.id)}
            >
              {step.name}
            </Button>
          </React.Fragment>
        ))}
      </div>
      
      {onSave && (
        <Button 
          size="sm" 
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          {isSaving ? "Saving..." : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </Button>
      )}
    </div>
  );
}
