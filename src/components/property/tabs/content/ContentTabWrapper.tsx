
import { useState, useCallback, memo } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

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
  
  // We'll use the handlers.onSubmit but wrap it to perform additional tasks
  const handleSubmit = useCallback(async () => {
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

  const adaptedRemoveFeature = useCallback((id: string) => {
    if (handlers.onRemoveFeature) {
      handlers.onRemoveFeature(id);
      if (handlers.setPendingChanges) {
        handlers.setPendingChanges(true);
      } else {
        setPendingChanges(true);
      }
    }
  }, [handlers]);
  
  const adaptedUpdateFeature = useCallback((id: string, description: string) => {
    if (handlers.onUpdateFeature) {
      handlers.onUpdateFeature(id, description);
      if (handlers.setPendingChanges) {
        handlers.setPendingChanges(true);
      } else {
        setPendingChanges(true);
      }
    }
  }, [handlers]);
  
  const adaptedFieldChange = useCallback((field: keyof PropertyFormData, value: any) => {
    handlers.onFieldChange(field, value);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
  }, [handlers]);

  // Handle tab change with autosave
  const handleTabChange = useCallback(async (step: number) => {
    // Save changes before changing tab if there are pending changes
    if (pendingChanges || (handlers.setPendingChanges && formData.id)) {
      console.log("Auto-saving before tab change...");
      try {
        await handleSubmit();
      } catch (error) {
        console.error("Error saving before tab change:", error);
        toast({
          title: "Warning",
          description: "There was an issue saving your changes",
          variant: "destructive",
        });
      }
    }
    
    // Now change the tab
    handlers.handleStepClick(step);
  }, [pendingChanges, formData.id, handlers, handleSubmit, toast]);

  if (handlers.isSaving || isSubmitting) {
    return (
      <div className="flex justify-center items-center my-8">
        <Spinner className="h-8 w-8 text-primary" />
        <span className="ml-3 text-lg text-primary">Saving changes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hideNavigation && (
        <ContentTabNavigation 
          currentStep={handlers.currentStep}
          onStepClick={handleTabChange}
          lastSaved={lastSaved}
          onSave={handleSubmit}
          isSaving={handlers.isSaving || false}
        />
      )}
      
      <ContentTabContent
        property={property} 
        formState={formData}
        onFieldChange={adaptedFieldChange}
        onAddFeature={handlers.onAddFeature}
        onRemoveFeature={adaptedRemoveFeature}
        onUpdateFeature={adaptedUpdateFeature}
        currentStep={handlers.currentStep}
        handleStepClick={handlers.handleStepClick}
        onSubmit={handleSubmit}
        isReadOnly={isReadOnly}
        hideNavigation={hideNavigation}
        // Pass through all other needed handlers
        onAddArea={handlers.onAddArea}
        onRemoveArea={handlers.onRemoveArea}
        onUpdateArea={handlers.onUpdateArea}
        onAreaImageRemove={handlers.onAreaImageRemove}
        onAreaImagesSelect={handlers.onAreaImagesSelect}
        handleAreaImageUpload={handlers.handleAreaImageUpload}
        onFetchLocationData={handlers.onFetchLocationData}
        onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
        isLoadingLocationData={handlers.isLoadingLocationData}
        isUploading={handlers.isUploading}
      />
    </div>
  );
});
