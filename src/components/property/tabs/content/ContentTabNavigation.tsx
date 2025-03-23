
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  lastSaved: Date | null;
  onSave: () => void;
  isSaving: boolean;
}

const steps = [
  { id: 0, label: "General" },
  { id: 1, label: "Features" },
  { id: 2, label: "Areas" },
  { id: 3, label: "Location" }
];

export function ContentTabNavigation({ 
  currentStep, 
  onStepClick, 
  lastSaved,
  onSave,
  isSaving
}: ContentTabNavigationProps) {
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission
    onSave();
  };

  return (
    <div className="flex items-center justify-between">
      <Tabs 
        value={currentStep.toString()} 
        onValueChange={(value) => onStepClick(parseInt(value))}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full">
          {steps.map((step) => (
            <TabsTrigger key={step.id} value={step.id.toString()}>
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2 ml-4">
        {lastSaved && (
          <span className="text-xs text-muted-foreground">
            Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
          </span>
        )}
        
        <Button 
          size="sm" 
          onClick={handleSaveClick}
          disabled={isSaving}
          variant="outline"
          type="button"
        >
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
