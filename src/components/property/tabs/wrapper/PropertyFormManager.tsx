
import { useState, useEffect } from "react";
import { PropertyData, PropertyTechnicalItem } from "@/types/property";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyMainImages } from "@/hooks/images/usePropertyMainImages";
import { useToast } from "@/components/ui/use-toast";

interface PropertyFormManagerProps {
  property: PropertyData;
  children: (props: {
    formState: any;
    handleFieldChange: (field: keyof PropertyData, value: any) => void;
    handleSaveObjectId: (objectId: string) => void;
    handleSaveAgent: (agentId: string) => void;
    handleSaveTemplate: (templateId: string) => void;
    addFeature: () => void;
    removeFeature: (id: string) => void;
    updateFeature: (id: string, description: string) => void;
    addTechnicalItem: () => void;
    removeTechnicalItem: (id: string) => void;
    updateTechnicalItem: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
    addArea: () => void;
    removeArea: (id: string) => void;
    updateArea: (id: string, field: any, value: any) => void;
    handleAreaImageUpload: (areaId: string, files: FileList) => void;
    handleAreaImageRemove: (areaId: string, imageId: string) => void;
    handleAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: (index: number) => void;
    isUploading: boolean;
    handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveAreaPhoto: (index: number) => void;
    handleRemoveFloorplan: (index: number) => void;
    handleUpdateFloorplan: (index: number, field: any, value: any) => void;
    handleSetFeaturedImage: (url: string | null) => void;
    handleToggleGridImage: (url: string) => void;
    onSubmit: () => void;
    currentStep: number;
    handleStepClick: (step: number) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    propertyWithRequiredProps: any;
    lastSaved: Date | null;
    isSaving: boolean;
  }) => React.ReactNode;
}

export function PropertyFormManager({ property, children }: PropertyFormManagerProps) {
  // Form state management
  const { formState, setFormState, handleFieldChange } = usePropertyFormState(property);
  const { toast } = useToast();
  
  // Auto-save state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  // Handle form submission
  const { handleSubmit } = usePropertyFormSubmit();
  
  // Create a wrapper function that also sets pendingChanges flag
  const handleFieldChangeWithFlag = (field: keyof PropertyData, value: any) => {
    handleFieldChange(field, value);
    setPendingChanges(true);
  };
  
  // Handle property content
  const {
    addFeature,
    removeFeature,
    updateFeature,
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem,
  } = usePropertyContent(
    formState,
    handleFieldChangeWithFlag
  );
  
  // Handle property areas
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
  } = usePropertyAreas(
    formState, 
    handleFieldChangeWithFlag
  );
  
  // Create a wrapper function for setFormState that also sets pendingChanges flag
  const setFormStateWithFlag = (newState: PropertyData) => {
    setFormState(newState);
    setPendingChanges(true);
  };
  
  // Handle property images
  const {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
  } = usePropertyImages(
    formState, 
    setFormStateWithFlag
  );
  
  // Handle main image functionality
  const { handleSetFeaturedImage, handleToggleGridImage } = usePropertyMainImages(
    formState, 
    setFormStateWithFlag
  );
  
  // Auto-save functionality
  useEffect(() => {
    if (formState.id && pendingChanges) {
      const timer = setTimeout(() => {
        console.log("Auto-saving property data...");
        setIsSaving(true);
        
        // Create a form event
        const formEvent = {} as React.FormEvent;
        
        // Call handleSubmit with the formState and false for shouldRedirect
        handleSubmit(formEvent, formState, false)
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
          })
          .finally(() => {
            setIsSaving(false);
          });
      }, 2000); // 2-second delay for auto-save
      
      return () => clearTimeout(timer);
    }
  }, [formState, pendingChanges]);
  
  // Form steps
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleStepClick = (step: number) => {
    console.log("Step clicked:", step);
    // Auto-save before changing step if there are pending changes
    if (pendingChanges && formState.id) {
      setIsSaving(true);
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formState, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed with step change
            setCurrentStep(step);
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
          setCurrentStep(step);
        })
        .finally(() => {
          setIsSaving(false);
        });
    } else {
      // No pending changes, just change step
      setCurrentStep(step);
    }
  };
  
  const handleNext = () => {
    console.log("Next clicked");
    // Auto-save before proceeding if there are pending changes
    if (pendingChanges && formState.id) {
      setIsSaving(true);
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formState, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now proceed to next step
            if (currentStep < 5) {
              setCurrentStep(currentStep + 1);
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
          if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
          }
        })
        .finally(() => {
          setIsSaving(false);
        });
    } else {
      // No pending changes, just proceed
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked");
    // Auto-save before going back if there are pending changes
    if (pendingChanges && formState.id) {
      setIsSaving(true);
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formState, false)
        .then((success) => {
          if (success) {
            setLastSaved(new Date());
            setPendingChanges(false);
            // Now go to previous step
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
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
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
          }
        })
        .finally(() => {
          setIsSaving(false);
        });
    } else {
      // No pending changes, just go back
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const onSubmit = () => {
    // Final save when clicking submit
    if (formState.id) {
      setIsSaving(true);
      const formEvent = {} as React.FormEvent;
      handleSubmit(formEvent, formState, false)
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
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  };

  // Handle saving object ID
  const handleSaveObjectId = (objectId: string) => {
    handleFieldChange('object_id', objectId);
    setPendingChanges(true);
  };

  // Handle saving agent
  const handleSaveAgent = (agentId: string) => {
    handleFieldChange('agent_id', agentId);
    setPendingChanges(true);
  };

  // Handle saving template
  const handleSaveTemplate = (templateId: string) => {
    handleFieldChange('template_id', templateId);
    setPendingChanges(true);
  };

  // Cast property to PropertyData to ensure it has required id
  const propertyWithRequiredId: PropertyData = {
    ...formState,
    id: property.id // Ensure id is always present
  };

  // Add back required properties for type compatibility
  const propertyWithRequiredProps = {
    ...propertyWithRequiredId,
    featuredImage: propertyWithRequiredId.featuredImage || null,
    gridImages: propertyWithRequiredId.gridImages || []
  };

  return children({
    formState,
    handleFieldChange: (field, value) => {
      handleFieldChange(field, value);
      setPendingChanges(true);
    },
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate,
    addFeature,
    removeFeature,
    updateFeature,
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem,
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage,
    onSubmit,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    propertyWithRequiredProps,
    lastSaved,
    isSaving
  });
}
