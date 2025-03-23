
import React, { useEffect } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabWrapper } from './content/ContentTabWrapper';
import { useParams, useNavigate } from 'react-router-dom';

interface PropertyContentTabProps {
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
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUpdateMode?: boolean;
    isUploading?: boolean;
    onSubmit: () => void;
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
  
  // Update step based on URL when component mounts or URL changes
  useEffect(() => {
    if (stepSlug && stepSlugMap[stepSlug] !== undefined && handlers.currentStep !== stepSlugMap[stepSlug]) {
      handlers.handleStepClick(stepSlugMap[stepSlug]);
    } else if (id && !stepSlug) {
      // If we're at /property/:id/content without a step, redirect to /property/:id/content/general
      navigate(`/property/${id}/content/general`);
    }
  }, [stepSlug, handlers, id, navigate, handlers.currentStep]);

  // Ensure all necessary props are passed to ContentTabWrapper
  const completeHandlers = {
    ...handlers,
    // Make sure onAreaImageUpload exists or use handleAreaImageUpload as fallback
    onAreaImageUpload: handlers.onAreaImageUpload || handlers.handleAreaImageUpload,
    // Ensure isSaving is always provided (non-optional)
    isSaving: handlers.isSaving || false
  };

  return (
    <ContentTabWrapper 
      formData={formData}
      property={property} 
      handlers={completeHandlers} 
    />
  );
}
