
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Save } from "lucide-react";
import { FormStepNavigation } from "../../form/FormStepNavigation";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  lastSaved: Date | null;
  onSave: () => Promise<boolean>;
  isSaving: boolean;
}

export function ContentTabNavigation({
  currentStep,
  onStepClick,
  lastSaved,
  onSave,
  isSaving
}: ContentTabNavigationProps) {
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event propagation
    console.log("Save button clicked in ContentTabNavigation, triggering onSave");
    return await onSave();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <FormStepNavigation
        currentStep={currentStep}
        onStepClick={onStepClick}
      />
      
      <div className="flex items-center gap-4">
        {lastSaved && (
          <p className="text-sm text-muted-foreground">
            Last saved: {format(lastSaved, "HH:mm:ss")}
          </p>
        )}
        
        <Button 
          onClick={handleSaveClick} 
          disabled={isSaving}
          className="min-w-[100px]"
          type="button"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
