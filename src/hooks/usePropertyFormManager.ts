
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
    setFormStateWithTracking // Use proper Dispatch<SetStateAction<PropertyFormData>> here
  );
  
  // Property images management - use setFormStateWithTracking 
  const {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
    images
  } = usePropertyImages(
    formState, 
    setFormStateWithTracking
  );
  
  // Import usePropertyMainImages directly here for better control
  const { usePropertyMainImages } = require("./images/usePropertyMainImages");
  const { handleSetFeaturedImage, handleToggleGridImage } = usePropertyMainImages(
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
    id: property.id // Ensure id is always present
  };

  // Add back required properties for type compatibility
  const propertyWithRequiredProps = {
    ...propertyWithRequiredId,
    featuredImage: propertyWithRequiredId.featuredImage || null,
    gridImages: propertyWithRequiredId.gridImages || []
  };

  return {
    formState,
    handleFieldChange: (field: keyof PropertyData, value: any) => {
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
  };
}
