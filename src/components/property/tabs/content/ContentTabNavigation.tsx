
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Home, Map, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  contentStepSlugs?: string[];
  propertyId?: string;
}

const steps = [
  { id: 0, label: "General", icon: <Home className="h-4 w-4 mr-1" />, slug: "general" },
  { id: 1, label: "Location", icon: <Map className="h-4 w-4 mr-1" />, slug: "location" },
  { id: 2, label: "Features", icon: <LayoutGrid className="h-4 w-4 mr-1" />, slug: "features" },
  { id: 3, label: "Areas", icon: <Book className="h-4 w-4 mr-1" />, slug: "areas" }
];

export function ContentTabNavigation({ 
  currentStep, 
  onStepClick,
  contentStepSlugs,
  propertyId
}: ContentTabNavigationProps) {
  // If using URL-based navigation (propertyId is provided)
  if (propertyId && contentStepSlugs) {
    return (
      <Tabs 
        value={currentStep.toString()} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full">
          {steps.map((step) => (
            <TabsTrigger 
              key={step.id} 
              value={step.id.toString()} 
              className="flex items-center justify-center"
              asChild
            >
              <Link 
                to={`/property/${propertyId}/content/${step.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onStepClick(step.id);
                }}
              >
                {step.icon}
                {step.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  }

  // Default behavior if not using URL-based navigation
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
