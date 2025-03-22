
import { useState } from 'react';
import { PropertyFormData, PropertyData } from "@/types/property";
import { ContentTabNavigation } from './ContentTabNavigation';
import { ContentTabContent } from './ContentTabContent';
import { usePropertyContentSubmit } from "@/hooks/usePropertyContentSubmit";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  property: PropertyData; // Added property field
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
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
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

export function ContentTabWrapper({ formData, property, handlers }: ContentTabWrapperProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);
  const { toast } = useToast();
  
  const { onSubmit, isSaving } = usePropertyContentSubmit(
    formData,
    handlers.setPendingChanges || setPendingChanges,
    setLastSaved,
    handlers.onSubmit
  );

  const handleNext = async () => {
    if (pendingChanges) {
      try {
        await onSubmit();
      } catch (error) {
        console.error("Error saving before navigation:", error);
        toast({
          title: "Warning",
          description: "There was an issue saving your changes",
          variant: "destructive",
        });
      }
    }
    
    if (handlers.currentStep < 3 && handlers.handleNext) {
      handlers.handleNext();
    }
  };

  const handlePrevious = async () => {
    if (pendingChanges) {
      try {
        await onSubmit();
      } catch (error) {
        console.error("Error saving before navigation:", error);
        toast({
          title: "Warning", 
          description: "There was an issue saving your changes",
          variant: "destructive",
        });
      }
    }
    
    if (handlers.currentStep > 0 && handlers.handlePrevious) {
      handlers.handlePrevious();
    }
  };

  const adaptedRemoveFeature = (id: string) => {
    handlers.onRemoveFeature(id);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
  };
  
  const adaptedUpdateFeature = (id: string, description: string) => {
    handlers.onUpdateFeature(id, description);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
  };
  
  const adaptedFieldChange = (field: keyof PropertyFormData, value: any) => {
    handlers.onFieldChange(field, value);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    } else {
      setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      <ContentTabNavigation 
        currentStep={handlers.currentStep}
        onStepClick={handlers.handleStepClick}
        lastSaved={lastSaved}
        onSave={onSubmit}
        isSaving={isSaving || handlers.isSaving || false}
      />
      
      <ContentTabContent
        property={property} 
        formState={formData}
        onFieldChange={adaptedFieldChange}
        onAddFeature={handlers.onAddFeature}
        onRemoveFeature={adaptedRemoveFeature}
        onUpdateFeature={adaptedUpdateFeature}
        currentStep={handlers.currentStep}
        handleStepClick={handlers.handleStepClick}
        onSubmit={onSubmit}
        isReadOnly={false}
        hideNavigation={true} // Add this prop to hide the navigation in ContentTabContent
      />
      
      {/* Add Next/Previous buttons at this level */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={handlers.currentStep === 0 || isSaving || handlers.isSaving}
          type="button"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={onSubmit}
          type="button"
          disabled={isSaving || handlers.isSaving}
          className="ml-auto mr-2"
        >
          {isSaving || handlers.isSaving ? "Saving..." : "Save"}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={handlers.currentStep === 3 || isSaving || handlers.isSaving}
          type="button"
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
