
import { PropertyData, PropertyTechnicalItem } from "@/types/property";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { usePropertyStepNavigation } from "@/hooks/usePropertyStepNavigation";
import { usePropertyFormActions } from "@/hooks/usePropertyFormActions";
import { usePropertyStateTracking } from "@/hooks/usePropertyStateTracking";
import { usePropertyMainImages } from "@/hooks/images/usePropertyMainImages";

export function usePropertyFormManager(property: PropertyData) {
  // Form state management
  const { formState, setFormState, handleFieldChange } = usePropertyFormState(property);
  
  // Auto-save functionality
  const { 
    autosaveData, 
    isSaving, 
    lastSaved, 
    pendingChanges, 
    setPendingChanges, 
    setLastSaved 
  } = usePropertyAutoSave();
  
  // State tracking utilities with properly typed setter function
  const { handleFieldChangeWithTracking, setFormStateWithTracking } = 
    usePropertyStateTracking(
      formState, 
      handleFieldChange, 
      setFormState,
      setPendingChanges
    );
  
  // Property content management
  const {
    addFeature,
    removeFeature,
    updateFeature,
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem,
  } = usePropertyContent(
    formState,
    handleFieldChangeWithTracking
  );
  
  // Property areas management
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
  } = usePropertyAreas(
    formState, 
    setFormStateWithTracking
  );
  
  // Property images management - use setFormStateWithTracking 
  const {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    images
  } = usePropertyImages(
    formState, 
    setFormStateWithTracking
  );
  
  // Import directly instead of using require, and use updated method name
  const { handleSetFeaturedImage, handleToggleFeaturedImage } = usePropertyMainImages(
    formState, 
    setFormStateWithTracking
  );
  
  // Step navigation with auto-save
  const { currentStep, handleStepClick, handleNext, handlePrevious } = 
    usePropertyStepNavigation(formState, pendingChanges, setPendingChanges, setLastSaved);
  
  // Form submission and other actions
  const { handleSaveObjectId: baseSaveObjectId, handleSaveAgent: baseSaveAgent, 
    handleSaveTemplate: baseSaveTemplate, onSubmit } = 
    usePropertyFormActions(formState, setPendingChanges, setLastSaved);
  
  // Wrapper functions that combine action with field change
  const handleSaveObjectId = (objectId: string) => {
    const id = baseSaveObjectId(objectId);
    handleFieldChange('object_id', id);
  };

  const handleSaveAgent = (agentId: string) => {
    const id = baseSaveAgent(agentId);
    handleFieldChange('agent_id', id);
  };

  const handleSaveTemplate = (templateId: string) => {
    const id = baseSaveTemplate(templateId);
    handleFieldChange('template_id', id);
  };

  // Cast property to PropertyData to ensure it has required id
  const propertyWithRequiredId: PropertyData = {
    ...formState,
    id: property.id // Ensure id is present
  };

  return {
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
    handleToggleFeaturedImage,
    onSubmit,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    propertyWithRequiredProps: propertyWithRequiredId,
    lastSaved,
    isSaving
  };
}
