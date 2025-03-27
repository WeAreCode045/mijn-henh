
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Home, Map, LayoutGrid } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ContentTabNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  contentStepSlugs?: string[];
  propertyId?: string;
}

export const steps = [
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
  const { id } = useParams();
  const actualPropertyId = propertyId || id;
  
  // Log to help debug
  console.log("ContentTabNavigation - Current step:", currentStep);
  console.log("ContentTabNavigation - onStepClick is function:", typeof onStepClick === 'function');
  console.log("ContentTabNavigation - Property ID from props:", propertyId);
  console.log("ContentTabNavigation - Property ID from params:", id);

  // Make a robust handler with fallback
  const handleTabClick = (step: number) => {
    console.log("TabClick in ContentTabNavigation with step:", step);
    
    // First call the passed function for state management
    if (typeof onStepClick === 'function') {
      onStepClick(step);
    } else {
      console.warn("No step click handler function provided to ContentTabNavigation");
    }
    
    // Then handle URL-based navigation if we have a property ID
    if (actualPropertyId) {
      const slug = steps[step].slug;
      navigate(`/property/${actualPropertyId}/content/${slug}`);
    }
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
