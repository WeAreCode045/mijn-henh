
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FormStepNavigation } from "../../form/FormStepNavigation";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  lastSaved: Date | null;
  isSaving: boolean;
}

export function ContentTabNavigation({
  currentStep,
  onStepClick,
  lastSaved,
  isSaving
}: ContentTabNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <FormStepNavigation
        currentStep={currentStep}
        onStepClick={onStepClick}
      />
      
      <div className="flex items-center gap-4">
        {isSaving && (
          <p className="text-sm text-muted-foreground flex items-center">
            <span className="animate-spin mr-2">⏳</span>
            Saving...
          </p>
        )}
        {lastSaved && !isSaving && (
          <p className="text-sm text-muted-foreground">
            Last saved: {format(lastSaved, "HH:mm:ss")}
          </p>
        )}
      </div>
    </div>
  );
}
