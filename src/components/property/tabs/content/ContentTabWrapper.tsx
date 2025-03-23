
import React, { useState, useEffect, useMemo } from "react";
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentRouter } from "./ContentRouter";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { useParams } from "react-router-dom";

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  property: PropertyData; 
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea: () => void;
    onRemoveArea: (id: string) => void;
    onUpdateArea: (id: string, field: any, value: any) => void;
    onAreaImageRemove: (areaId: string, imageId: string) => void;
    onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
    onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    isUploading?: boolean;
  };
}

// Map from URL step slugs to step numbers
const stepSlugMap: Record<string, number> = {
  'general': 0,
  'location': 1,
  'features': 2,
  'areas': 3
};

export function ContentTabWrapper({ formData, property, handlers }: ContentTabWrapperProps) {
  const { step: stepSlug } = useParams<{ step: string }>();
  
  // Get functionality from usePropertyContent hook
  const contentHooks = usePropertyContent(formData, handlers.onFieldChange);
  
  // Memoize the step to prevent unnecessary renders
  const currentStep = useMemo(() => {
    if (stepSlug && stepSlugMap[stepSlug] !== undefined) {
      return stepSlugMap[stepSlug];
    }
    return handlers.currentStep;
  }, [stepSlug, handlers.currentStep]);

  // Ensure all necessary props are passed to ContentRouter
  const completeHandlers = useMemo(() => ({
    ...handlers,
    ...contentHooks,
    // Make sure onAreaImageUpload exists or use handleAreaImageUpload as fallback
    onAreaImageUpload: handlers.onAreaImageUpload || handlers.handleAreaImageUpload,
    // Override currentStep with our memoized value
    currentStep: currentStep
  }), [handlers, contentHooks, currentStep]);

  return (
    <ContentRouter 
      formData={formData}
      currentStep={currentStep}
      handlers={completeHandlers} 
    />
  );
}
