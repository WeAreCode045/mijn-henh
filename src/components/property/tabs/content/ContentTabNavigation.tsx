
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Home, Map, LayoutGrid } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // If using URL-based navigation (propertyId is provided)
  if (propertyId) {
    const handleTabClick = (step: number) => {
      // Update the step first
      onStepClick(step);
      // Then navigate to the correct URL
      const slug = steps[step].slug;
      navigate(`/property/${propertyId}/content/${slug}`);
    };

    return (
      <Tabs 
        value={String(currentStep)} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full">
          {steps.map((step) => (
            <TabsTrigger 
              key={step.id} 
              value={String(step.id)} 
              className="flex items-center justify-center"
              onClick={() => handleTabClick(step.id)}
            >
              {step.icon}
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  }

  // Default behavior if not using URL-based navigation
  return (
    <Tabs 
      value={String(currentStep)} 
      onValueChange={(value) => onStepClick(parseInt(value))}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full">
        {steps.map((step) => (
          <TabsTrigger key={step.id} value={String(step.id)} className="flex items-center justify-center">
            {step.icon}
            {step.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
