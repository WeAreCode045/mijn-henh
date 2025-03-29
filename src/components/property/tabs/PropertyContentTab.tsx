
import React, { useEffect } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabWrapper } from './content/ContentTabWrapper';
import { useParams, useNavigate } from 'react-router-dom';
import { steps } from './content/ContentTabNavigation';

interface PropertyContentTabProps {
  formData: PropertyFormData;
  property: PropertyData; 
  handlers: {
    onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature?: () => void;
    onRemoveFeature?: (id: string) => void;
    onUpdateFeature?: (id: string, description: string) => void;
    onAddArea?: () => void;
    onRemoveArea?: (id: string) => void;
    onUpdateArea?: (id: string, field: any, value: any) => void;
    onAreaImageRemove?: (areaId: string, imageId: string) => void;
    onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
    onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onFetchCategoryPlaces?: (category: string) => Promise<any>;
    onFetchNearbyCities?: () => Promise<any>;
    onGenerateLocationDescription?: () => Promise<void>;
    onGenerateMap?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    isGeneratingMap?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUpdateMode?: boolean;
    isUploading?: boolean;
    onSubmit?: () => void;
    isSaving?: boolean;
  };
}

// Map from URL step slugs to step numbers
const stepSlugMap: Record<string, number> = {
  'general': 0,
  'location': 1,
  'features': 2,
  'areas': 3
};

export function PropertyContentTab({ formData, property, handlers }: PropertyContentTabProps) {
  // Get the current step from the URL
  const { step: stepSlug, id } = useParams<{ step: string; id: string }>();
  const navigate = useNavigate();
  
  // Add debug logging
  console.log("PropertyContentTab - handlers.handleStepClick is function:", typeof handlers.handleStepClick === 'function');
  console.log("PropertyContentTab - Current step:", handlers.currentStep);
  console.log("PropertyContentTab - Step slug from URL:", stepSlug);
  console.log("PropertyContentTab - Property ID:", id);
  console.log("PropertyContentTab - onAddArea is function:", typeof handlers.onAddArea === 'function');
  
  // Update step based on URL when component mounts or URL changes
  useEffect(() => {
    if (stepSlug && stepSlugMap[stepSlug] !== undefined) {
      const stepNumber = stepSlugMap[stepSlug];
      console.log("PropertyContentTab - Calculating step from URL:", stepNumber);
      
      if (handlers.currentStep !== stepNumber) {
        console.log("PropertyContentTab - Updating step from URL to:", stepNumber);
        
        if (typeof handlers.handleStepClick === 'function') {
          handlers.handleStepClick(stepNumber);
        } else {
          console.error("PropertyContentTab - handleStepClick is not a function");
        }
      }
    } else if (id && !stepSlug) {
      // If we're at /property/:id/content without a step, redirect to /property/:id/content/general
      navigate(`/property/${id}/content/general`);
    }
  }, [stepSlug, handlers, id, navigate, handlers.currentStep]);

  // Check that we have valid data
  if (!formData || !property) {
    console.error("PropertyContentTab - Missing required data", { 
      hasFormData: !!formData, 
      hasProperty: !!property 
    });
    return <div>Loading property data...</div>;
  }

  // Create a fallback handleStepClick if needed
  const safeHandlers = {
    ...handlers,
    handleStepClick: typeof handlers.handleStepClick === 'function' 
      ? handlers.handleStepClick 
      : (step: number) => {
          console.log("PropertyContentTab - Using fallback handleStepClick:", step);
          if (id) {
            const stepSlug = steps.find(s => s.id === step)?.slug || 'general';
            navigate(`/property/${id}/content/${stepSlug}`);
          }
        },
    // Make sure onAreaImageUpload exists or use handleAreaImageUpload as fallback
    onAreaImageUpload: handlers.onAreaImageUpload || handlers.handleAreaImageUpload,
    // Ensure onAddArea has a fallback
    onAddArea: handlers.onAddArea || (() => {
      console.warn("PropertyContentTab - No onAddArea handler provided");
    }),
    // Ensure onFieldChange is always available
    onFieldChange: handlers.onFieldChange || ((field: keyof PropertyFormData, value: any) => {
      console.log(`PropertyContentTab - Fallback onFieldChange: ${String(field)} =`, value);
    })
  };

  return (
    <ContentTabWrapper 
      formData={formData}
      property={property} 
      handlers={safeHandlers} 
    />
  );
}
