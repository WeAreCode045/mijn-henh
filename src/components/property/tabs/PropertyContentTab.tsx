
import React from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabWrapper } from './content/ContentTabWrapper';

interface PropertyContentTabProps {
  formData: PropertyFormData;
  property: PropertyData; 
  hideNavigation?: boolean;
  isReadOnly?: boolean;
  handlers: {
    onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea?: () => void;
    onRemoveArea?: (id: string) => void;
    onUpdateArea?: (id: string, field: any, value: any) => void;
    onAreaImageRemove?: (areaId: string, imageId: string) => void;
    onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
    handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

export function PropertyContentTab({ 
  formData, 
  property, 
  handlers, 
  hideNavigation = false,
  isReadOnly = false
}: PropertyContentTabProps) {
  // Log to monitor handlers being passed
  console.log("PropertyContentTab - handlers provided:", Object.keys(handlers).join(", "));
  console.log("PropertyContentTab - onFieldChange is defined:", !!handlers.onFieldChange);
  
  // Create a dummy handler if it's missing
  if (!handlers.onFieldChange) {
    console.warn("PropertyContentTab - onFieldChange is not defined, creating a dummy handler");
    handlers = {
      ...handlers,
      onFieldChange: (field: keyof PropertyFormData, value: any) => {
        console.log(`DUMMY HANDLER - Field change requested but no handler available: ${String(field)} = `, value);
      }
    };
  }
  
  // Ensure the onSubmit handler is properly logged
  const enhancedHandlers = {
    ...handlers,
    onFieldChange: (field: keyof PropertyFormData, value: any) => {
      console.log(`PropertyContentTab - onFieldChange: ${String(field)} = `, value);
      if (handlers.onFieldChange) {
        handlers.onFieldChange(field, value);
      } else {
        console.warn(`PropertyContentTab - No onFieldChange handler for field: ${String(field)}`);
      }
    },
    onSubmit: () => {
      console.log("PropertyContentTab - onSubmit called");
      handlers.onSubmit();
    }
  };

  return (
    <ContentTabWrapper 
      formData={formData}
      property={property} 
      handlers={enhancedHandlers}
      hideNavigation={hideNavigation}
      isReadOnly={isReadOnly}
    />
  );
}
