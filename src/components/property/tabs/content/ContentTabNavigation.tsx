
import React from "react";
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
  
  // Log to help debug
  console.log("ContentTabNavigation - Current step:", currentStep);
  console.log("ContentTabNavigation - onStepClick is function:", typeof onStepClick === 'function');

  // Make a robust handler with fallback
  const handleTabClick = (step: number) => {
    console.log("TabClick in ContentTabNavigation with step:", step);
    
    // If using URL-based navigation and propertyId is provided
    if (propertyId) {
      // Always try to call the passed function first
      if (typeof onStepClick === 'function') {
        onStepClick(step);
      } else {
        console.warn("No step click handler function provided to ContentTabNavigation");
      }
      
      // Navigate regardless of whether onStepClick worked
      const slug = steps[step].slug;
      navigate(`/property/${propertyId}/content/${slug}`);
      return;
    }
    
    // For non-URL based navigation, just call the handler
    if (typeof onStepClick === 'function') {
      onStepClick(step);
    } else {
      console.warn("No step click handler function provided to ContentTabNavigation");
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
