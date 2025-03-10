
import { PropertyData } from "@/types/property";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { usePropertyStepNavigation } from "@/hooks/usePropertyStepNavigation";
import { usePropertyFormActions } from "@/hooks/usePropertyFormActions";
import { usePropertyStateTracking } from "@/hooks/usePropertyStateTracking";

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
  } = usePropertyContent(
    formState,
    handleFieldChangeWithTracking
  );
  
  // Property areas management
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload  // This should now be returned from usePropertyAreas
  } = usePropertyAreas(
    formState, 
    setFormStateWithTracking
  );
  
  // Property images management - use setFormStateWithTracking 
  const {
    handleImageUpload,
    handleRemoveImage,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    images
  } = usePropertyImages(
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
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload, // Include this in the returned object
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
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
