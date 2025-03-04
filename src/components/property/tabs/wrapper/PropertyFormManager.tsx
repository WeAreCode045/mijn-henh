
import { PropertyData, PropertyTechnicalItem } from "@/types/property";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyMainImages } from "@/hooks/images/usePropertyMainImages";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { usePropertyStepNavigation } from "@/hooks/usePropertyStepNavigation";
import { usePropertyFormActions } from "@/hooks/usePropertyFormActions";
import { usePropertyStateTracking } from "@/hooks/usePropertyStateTracking";

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
  
  // Auto-save state management
  const { lastSaved, isSaving, pendingChanges, setPendingChanges, setLastSaved } = 
    usePropertyAutoSave(formState, formState.id);
  
  // State tracking utilities
  const { handleFieldChangeWithTracking, setFormStateWithTracking } = 
    usePropertyStateTracking(formState, handleFieldChange, setFormState, setPendingChanges);
  
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
    handleFieldChangeWithTracking
  );
  
  // Property images management
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
    setFormStateWithTracking
  );
  
  // Main image functionality
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
