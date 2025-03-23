
import React from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabWrapper } from './content/ContentTabWrapper';

interface PropertyContentTabProps {
  formData: PropertyFormData;
  property: PropertyData; 
  hideNavigation?: boolean;
  isReadOnly?: boolean;
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
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
  
  // Ensure the onSubmit handler is properly logged
  const enhancedHandlers = {
    ...handlers,
    onFieldChange: (field: keyof PropertyFormData, value: any) => {
      console.log(`PropertyContentTab - onFieldChange: ${String(field)} = `, value);
      handlers.onFieldChange(field, value);
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
