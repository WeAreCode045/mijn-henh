
import { useState, useCallback, memo } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabContent } from './ContentTabContent';
import { useToast } from "@/components/ui/use-toast";

interface ContentTabWrapperProps {
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
    handleNext?: () => void;
    handlePrevious?: () => void;
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    onSubmit: () => void;
    isSaving?: boolean;
  };
}

// Using memo to prevent unnecessary re-renders
export const ContentTabWrapper = memo(function ContentTabWrapper({ 
  formData, 
  property, 
  handlers, 
  hideNavigation = false,
  isReadOnly = false
}: ContentTabWrapperProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  
  console.log("ContentTabWrapper - formData:", Object.keys(formData));
  console.log("ContentTabWrapper - handlers.onFieldChange is defined:", !!handlers.onFieldChange);
  
  // We'll use the handlers.onSubmit but wrap it to perform additional tasks
  const handleSubmit = useCallback(() => {
    console.log("ContentTabWrapper - handleSubmit called");
    
    try {
      setIsSubmitting(true);
      
      // Call the original onSubmit handler
      handlers.onSubmit();
      
      // Update local state
      setLastSaved(new Date());
      if (handlers.setPendingChanges) {
        handlers.setPendingChanges(false);
      } else {
        setPendingChanges(false);
      }
      
      // Show success toast
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
    } catch (error) {
      console.error("Error during ContentTabWrapper save:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [handlers, toast]);

  console.log("ContentTabWrapper rendering with currentStep:", handlers.currentStep);

  const handleFieldChange = useCallback((field: keyof PropertyFormData, value: any) => {
    console.log(`ContentTabWrapper - handleFieldChange: ${String(field)} = `, value);
    handlers.onFieldChange(field, value);
  }, [handlers]);

  return (
    <ContentTabContent
      property={property}
      formState={formData}
      onFieldChange={handleFieldChange}
      onAddFeature={handlers.onAddFeature}
      onRemoveFeature={handlers.onRemoveFeature}
      onUpdateFeature={handlers.onUpdateFeature}
      onAddArea={handlers.onAddArea}
      onRemoveArea={handlers.onRemoveArea}
      onUpdateArea={handlers.onUpdateArea}
      onAreaImageRemove={handlers.onAreaImageRemove}
      onAreaImagesSelect={handlers.onAreaImagesSelect}
      handleAreaImageUpload={handlers.handleAreaImageUpload}
      currentStep={handlers.currentStep}
      handleStepClick={handlers.handleStepClick}
      handleNext={handlers.handleNext}
      handlePrevious={handlers.handlePrevious}
      onFetchLocationData={handlers.onFetchLocationData}
      onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
      isLoadingLocationData={handlers.isLoadingLocationData}
      setPendingChanges={handlers.setPendingChanges || setPendingChanges}
      isUploading={handlers.isUploading}
      onSubmit={handleSubmit}
      isSaving={isSubmitting || handlers.isSaving}
      hideNavigation={hideNavigation}
      isReadOnly={isReadOnly}
    />
  );
});
