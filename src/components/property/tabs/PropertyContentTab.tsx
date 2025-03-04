
import { useState, useEffect } from "react";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";
import { steps } from "@/components/property/form/formSteps";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";

interface PropertyContentTabProps {
  formData: PropertyFormData;
  currentStep?: number;
  handleStepClick?: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onSubmit?: () => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  isUpdateMode: boolean;
  isUploading?: boolean;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
}

export function PropertyContentTab({
  formData,
  currentStep: externalCurrentStep,
  handleStepClick: externalHandleStepClick,
  handleNext: externalHandleNext,
  handlePrevious: externalHandlePrevious,
  onSubmit: externalOnSubmit,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleUpdateFloorplan,
  handleMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  isUpdateMode,
  isUploading,
  handleSetFeaturedImage,
  handleToggleGridImage,
}: PropertyContentTabProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const { toast } = useToast();
  const { handleSubmit } = usePropertyFormSubmit();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;
  
  // Auto-save functionality
  useEffect(() => {
    if (formData.id && pendingChanges) {
      const timer = setTimeout(() => {
        console.log("Auto-saving form data...");
        
        // Create a form event
        const formEvent = {} as React.FormEvent;
        
        // Call handleSubmit with the formData and false for shouldRedirect
        handleSubmit(formEvent, formData, false)
          .then((success) => {
            if (success) {
              setLastSaved(new Date());
              setPendingChanges(false);
              toast({
                description: "Changes saved automatically",
                duration: 2000,
              });
            }
          })
          .catch((error) => {
            console.error("Auto-save failed:", error);
            toast({
              title: "Auto-save failed",
              description: "Your changes couldn't be saved automatically",
              variant: "destructive",
            });
          });
      }, 2000); // 2-second delay for auto-save
      
      return () => clearTimeout(timer);
    }
  }, [formData, pendingChanges]);
  
  // Track changes to set pendingChanges flag
  useEffect(() => {
    setPendingChanges(true);
  }, [formData]);
  
  const safeAddTechnicalItem = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onAddTechnicalItem) {
      console.log("Adding technical item");
      onAddTechnicalItem();
    }
  };
  
  const safeRemoveTechnicalItem = (id: string) => {
    if (onRemoveTechnicalItem) {
      console.log("Removing technical item", id);
      onRemoveTechnicalItem(id);
    }
  };
  
  const handleStepClick = (step: number) => {
    console.log("Step clicked in PropertyContentTab:", step);
    // Auto-save before changing step if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed with step change
            if (externalHandleStepClick) {
              externalHandleStepClick(step);
            } else {
              setInternalCurrentStep(step);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before changing step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before changing step",
            variant: "destructive",
          });
          // Still allow step change
          if (externalHandleStepClick) {
            externalHandleStepClick(step);
          } else {
            setInternalCurrentStep(step);
          }
        });
    } else {
      // No pending changes, just change step
      if (externalHandleStepClick) {
        externalHandleStepClick(step);
      } else {
        setInternalCurrentStep(step);
      }
    }
  };
  
  const handleNext = () => {
    console.log("Next clicked in PropertyContentTab");
    // Auto-save before proceeding if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed to next step
            if (externalHandleNext) {
              externalHandleNext();
            } else if (internalCurrentStep < steps.length) {
              setInternalCurrentStep(internalCurrentStep + 1);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before proceeding to next step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before proceeding",
            variant: "destructive",
          });
          // Still allow step change
          if (externalHandleNext) {
            externalHandleNext();
          } else if (internalCurrentStep < steps.length) {
            setInternalCurrentStep(internalCurrentStep + 1);
          }
        });
    } else {
      // No pending changes, just proceed
      if (externalHandleNext) {
        externalHandleNext();
      } else if (internalCurrentStep < steps.length) {
        setInternalCurrentStep(internalCurrentStep + 1);
      }
    }
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked in PropertyContentTab");
    // Auto-save before going back if there are pending changes
    if (pendingChanges && formData.id) {
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formData, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now go to previous step
            if (externalHandlePrevious) {
              externalHandlePrevious();
            } else if (internalCurrentStep > 1) {
              setInternalCurrentStep(internalCurrentStep - 1);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to save before going to previous step:", error);
          toast({
            title: "Warning",
            description: "Changes couldn't be saved before going back",
            variant: "destructive",
          });
          // Still allow step change
          if (externalHandlePrevious) {
            externalHandlePrevious();
          } else if (internalCurrentStep > 1) {
            setInternalCurrentStep(internalCurrentStep - 1);
          }
        });
    } else {
      // No pending changes, just go back
      if (externalHandlePrevious) {
        externalHandlePrevious();
      } else if (internalCurrentStep > 1) {
        setInternalCurrentStep(internalCurrentStep - 1);
      }
    }
  };
  
  const onSubmit = () => {
    console.log("Submit clicked in PropertyContentTab");
    if (externalOnSubmit) {
      externalOnSubmit();
    } else {
      console.log("Form submitted in PropertyContentTab");
      
      // Final save when clicking submit
      if (formData.id) {
        const formEvent = {} as React.FormEvent;
        handleSubmit(formEvent, formData, false)
          .then((success) => {
            if (success) {
              setLastSaved(new Date());
              setPendingChanges(false);
              toast({
                title: "Success",
                description: "All changes have been saved",
              });
            }
          })
          .catch((error) => {
            console.error("Final save failed:", error);
            toast({
              title: "Error",
              description: "Failed to save all changes",
              variant: "destructive",
            });
          });
      }
    }
  };

  return (
    <div className="space-y-4">
      <FormStepNavigation
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={onSubmit}
        isUpdateMode={isUpdateMode}
      />
      
      {lastSaved && (
        <div className="text-xs text-muted-foreground text-right">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
      
      <PropertyFormContent
        step={currentStep}
        formData={formData}
        onFieldChange={(field, value) => {
          onFieldChange(field, value);
          setPendingChanges(true);
        }}
        onAddFeature={() => {
          onAddFeature();
          setPendingChanges(true);
        }}
        onRemoveFeature={(id) => {
          onRemoveFeature(id);
          setPendingChanges(true);
        }}
        onUpdateFeature={(id, description) => {
          onUpdateFeature(id, description);
          setPendingChanges(true);
        }}
        onAddArea={() => {
          onAddArea();
          setPendingChanges(true);
        }}
        onRemoveArea={(id) => {
          onRemoveArea(id);
          setPendingChanges(true);
        }}
        onUpdateArea={(id, field, value) => {
          onUpdateArea(id, field, value);
          setPendingChanges(true);
        }}
        onAreaImageUpload={onAreaImageUpload}
        onAreaImageRemove={onAreaImageRemove}
        onAreaImagesSelect={onAreaImagesSelect}
        handleImageUpload={handleImageUpload}
        handleAreaPhotosUpload={handleAreaPhotosUpload}
        handleFloorplanUpload={handleFloorplanUpload}
        handleRemoveImage={handleRemoveImage}
        handleRemoveAreaPhoto={handleRemoveAreaPhoto}
        handleRemoveFloorplan={handleRemoveFloorplan}
        handleUpdateFloorplan={handleUpdateFloorplan}
        handleMapImageDelete={handleMapImageDelete}
        onFetchLocationData={onFetchLocationData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        onAddTechnicalItem={() => {
          safeAddTechnicalItem();
          setPendingChanges(true);
        }}
        onRemoveTechnicalItem={(id) => {
          safeRemoveTechnicalItem(id);
          setPendingChanges(true);
        }}
        onUpdateTechnicalItem={(id, field, value) => {
          if (onUpdateTechnicalItem) {
            onUpdateTechnicalItem(id, field, value);
            setPendingChanges(true);
          }
        }}
        handleSetFeaturedImage={(url) => {
          if (handleSetFeaturedImage) {
            handleSetFeaturedImage(url);
            setPendingChanges(true);
          }
        }}
        handleToggleGridImage={(url) => {
          if (handleToggleGridImage) {
            handleToggleGridImage(url);
            setPendingChanges(true);
          }
        }}
        isUploading={isUploading}
      />
    </div>
  );
}
