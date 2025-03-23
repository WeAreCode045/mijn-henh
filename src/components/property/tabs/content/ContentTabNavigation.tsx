
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Home, Map, LayoutGrid } from "lucide-react";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { id: 0, label: "General", icon: <Home className="h-4 w-4 mr-1" /> },
  { id: 1, label: "Location", icon: <Map className="h-4 w-4 mr-1" /> },
  { id: 2, label: "Features", icon: <LayoutGrid className="h-4 w-4 mr-1" /> },
  { id: 3, label: "Areas", icon: <Book className="h-4 w-4 mr-1" /> }
];

export function ContentTabNavigation({ 
  currentStep, 
  onStepClick
}: ContentTabNavigationProps) {
  return (
    <Tabs 
      value={currentStep.toString()} 
      onValueChange={(value) => onStepClick(parseInt(value))}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full">
        {steps.map((step) => (
          <TabsTrigger key={step.id} value={step.id.toString()} className="flex items-center justify-center">
            {step.icon}
            {step.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
