
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface StepButtonProps {
  number: number;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

function StepButton({ number, title, isActive, onClick }: StepButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className="justify-start px-3"
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
          isActive ? "bg-white text-black" : "bg-muted text-muted-foreground"
        }`}>
          {number + 1}
        </span>
        {title}
      </div>
    </Button>
  );
}

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  lastSaved: Date | null;
  onSave: () => void;
  isSaving: boolean;
}

export function ContentTabNavigation({
  currentStep,
  onStepClick,
  lastSaved,
  onSave,
  isSaving
}: ContentTabNavigationProps) {
  const steps = [
    { number: 0, title: "General Info" },
    { number: 1, title: "Features" },
    { number: 2, title: "Areas" },
    { number: 3, title: "Location" }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((step) => (
              <StepButton
                key={step.number}
                number={step.number}
                title={step.title}
                isActive={currentStep === step.number}
                onClick={() => onStepClick(step.number)}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <span className="text-sm text-muted-foreground">
                Last saved: {format(lastSaved, "HH:mm:ss")}
              </span>
            )}
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant="default" 
              onClick={onSave}
              disabled={isSaving}
              className="px-4"
            >
              {isSaving ? "Saving..." : "Save"}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
