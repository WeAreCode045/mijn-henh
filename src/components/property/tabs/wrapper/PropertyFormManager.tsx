
import { useState, useCallback, useEffect } from "react";
import { usePropertyFormState } from "@/hooks/property-form/usePropertyFormState";
import { usePropertyFormActions } from "@/hooks/property-form/usePropertyFormActions";
import { usePropertyFormFields } from "@/hooks/property-form/usePropertyFormFields";
import { usePropertyFormImages } from "@/hooks/property-form/usePropertyFormImages";
import { usePropertyFormAreas } from "@/hooks/property-form/usePropertyFormAreas";
import { usePropertyFormSteps } from "@/hooks/property-form/usePropertyFormSteps";
import { usePropertyLocationData } from "@/hooks/property-form/usePropertyLocationData";
import { PropertyData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

interface PropertyFormManagerProps {
  property: PropertyData;
  isArchived?: boolean;
  children: (props: any) => React.ReactNode;
}

export function PropertyFormManager({ 
  property, 
  isArchived = false,
  children 
}: PropertyFormManagerProps) {
  const { toast } = useToast();
  const [lastSaved, setLastSaved] = useState<Date | null>(
    property.updated_at ? new Date(property.updated_at) : null
  );
  const [pendingChanges, setPendingChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Setup form state
  const { formState, handleFieldChange } = usePropertyFormState(property, setPendingChanges);
  
  // Property form actions
  const { 
    handleSaveObjectId, 
    handleSaveAgent, 
    onSubmit 
  } = usePropertyFormActions(
    formState,
    setPendingChanges,
    setLastSaved
  );
  
  // Property form fields
  const { 
    addFeature, 
    removeFeature, 
    updateFeature 
  } = usePropertyFormFields(
    formState, 
    handleFieldChange
  );
  
  // Property form images
  const { 
    handleImageUpload, 
    handleRemoveImage, 
    isUploading,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate,
  } = usePropertyFormImages(
    formState.id, 
    formState, 
    handleFieldChange, 
    setPendingChanges
  );
  
  // Property form areas
  const { 
    addArea, 
    removeArea, 
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    handleAreaPhotosUpload, 
    handleRemoveAreaPhoto
  } = usePropertyFormAreas(
    formState, 
    handleFieldChange, 
    setPendingChanges
  );
  
  // Property form steps
  const { 
    currentStep, 
    handleStepClick 
  } = usePropertyFormSteps();
  
  // Property form location data
  const {
    onFetchLocationData,
    onGenerateLocationDescription,
    onGenerateMap,
    onRemoveNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    onFetchCategoryPlaces,
    onFetchNearbyCities
  } = usePropertyLocationData(
    formState,
    handleFieldChange,
    setPendingChanges
  );

  // Add property ID to formState if it doesn't exist
  const propertyWithRequiredProps = {
    ...formState,
    id: formState.id || '',
  };

  // Modification wrapper to handle archived status
  const wrapMethod = useCallback((method: Function) => {
    return (...args: any[]) => {
      if (isArchived) {
        toast({
          title: "Action blocked",
          description: "This property is archived. Unarchive it first to make changes.",
          variant: "destructive",
        });
        return Promise.resolve();
      }
      return method(...args);
    };
  }, [isArchived, toast]);

  // Wrap all modification methods when property is archived
  const wrappedMethods = {
    handleFieldChange: wrapMethod(handleFieldChange),
    handleSaveObjectId: wrapMethod(handleSaveObjectId),
    handleSaveAgent: isArchived ? handleSaveAgent : wrapMethod(handleSaveAgent), // Allow agent changes even when archived
    addFeature: wrapMethod(addFeature),
    removeFeature: wrapMethod(removeFeature),
    updateFeature: wrapMethod(updateFeature),
    addArea: wrapMethod(addArea),
    removeArea: wrapMethod(removeArea),
    updateArea: wrapMethod(updateArea),
    handleAreaImageRemove: wrapMethod(handleAreaImageRemove),
    handleAreaImagesSelect: wrapMethod(handleAreaImagesSelect),
    handleAreaImageUpload: wrapMethod(handleAreaImageUpload),
    handleImageUpload: wrapMethod(handleImageUpload),
    handleRemoveImage: wrapMethod(handleRemoveImage),
    handleAreaPhotosUpload: wrapMethod(handleAreaPhotosUpload),
    handleRemoveAreaPhoto: wrapMethod(handleRemoveAreaPhoto),
    handleFloorplanUpload: wrapMethod(handleFloorplanUpload),
    handleRemoveFloorplan: wrapMethod(handleRemoveFloorplan),
    handleSetFeaturedImage: wrapMethod(handleSetFeaturedImage),
    handleToggleFeaturedImage: wrapMethod(handleToggleFeaturedImage),
    handleVirtualTourUpdate: wrapMethod(handleVirtualTourUpdate),
    handleYoutubeUrlUpdate: wrapMethod(handleYoutubeUrlUpdate),
    handleFloorplanEmbedScriptUpdate: wrapMethod(handleFloorplanEmbedScriptUpdate),
    onSubmit: wrapMethod(onSubmit),
    onFetchLocationData: wrapMethod(onFetchLocationData),
    onGenerateLocationDescription: wrapMethod(onGenerateLocationDescription),
    onGenerateMap: wrapMethod(onGenerateMap),
    onRemoveNearbyPlace: wrapMethod(onRemoveNearbyPlace),
    onFetchCategoryPlaces: wrapMethod(onFetchCategoryPlaces),
    onFetchNearbyCities: wrapMethod(onFetchNearbyCities),
    setPendingChanges: wrapMethod(setPendingChanges),
  };

  // Use the original methods or the wrapped methods based on the archived status
  const methods = isArchived ? wrappedMethods : {
    handleFieldChange,
    handleSaveObjectId,
    handleSaveAgent,
    addFeature,
    removeFeature,
    updateFeature,
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate,
    onSubmit,
    onFetchLocationData,
    onGenerateLocationDescription,
    onGenerateMap,
    onRemoveNearbyPlace,
    onFetchCategoryPlaces,
    onFetchNearbyCities,
    setPendingChanges,
  };

  return children({
    ...methods,
    formState,
    isUploading,
    isUploadingFloorplan,
    currentStep,
    handleStepClick,
    propertyWithRequiredProps,
    lastSaved,
    isSaving,
    isLoadingLocationData,
    isGeneratingMap,
  });
}
