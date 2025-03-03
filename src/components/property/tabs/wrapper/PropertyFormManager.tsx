
import { useState } from "react";
import { PropertyData, PropertyTechnicalItem } from "@/types/property";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyImages } from "@/hooks/usePropertyImages";

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
  }) => React.ReactNode;
}

export function PropertyFormManager({ property, children }: PropertyFormManagerProps) {
  // Form state management
  const { formState, setFormState, handleFieldChange } = usePropertyFormState(property);
  
  // Handle form submission
  const { handleSubmit } = usePropertyFormSubmit();
  
  // Handle property content
  const {
    addFeature,
    removeFeature,
    updateFeature,
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem,
  } = usePropertyContent(formState, handleFieldChange);
  
  // Handle property areas
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
  } = usePropertyAreas(formState, setFormState);
  
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
    handleSetFeaturedImage,
    handleToggleGridImage,
  } = usePropertyImages(formState, setFormState);
  
  // Define autosave function (placeholder for now)
  const handleAutosave = () => {
    console.log("Autosaving...");
    // Actual autosave logic would go here
  };
  
  // Form steps
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleStepClick = (step: number) => {
    console.log("Step clicked:", step);
    setCurrentStep(step);
  };
  
  const handleNext = () => {
    console.log("Next clicked");
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    console.log("Previous clicked");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = () => {
    const formEl = document.getElementById('propertyForm') as HTMLFormElement;
    if (formEl) {
      // Create a FormEvent object
      const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
      // Pass false to prevent redirection
      handleSubmit(formEvent, formState, false);
    }
  };

  // Handle saving object ID
  const handleSaveObjectId = (objectId: string) => {
    handleFieldChange('object_id', objectId);
  };

  // Handle saving agent
  const handleSaveAgent = (agentId: string) => {
    handleFieldChange('agent_id', agentId);
  };

  // Handle saving template
  const handleSaveTemplate = (templateId: string) => {
    handleFieldChange('template_id', templateId);
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
    handleFieldChange,
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
    propertyWithRequiredProps
  });
}
