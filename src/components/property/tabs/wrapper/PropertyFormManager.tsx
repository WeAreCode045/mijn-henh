
import React from "react";
import { PropertyFormManagerProps } from "./types/PropertyFormManagerTypes";
import { usePropertyFormManagerState } from "@/hooks/property-form/usePropertyFormManagerState";
import { usePropertyActionWrapper } from "@/hooks/property-form/usePropertyActionWrapper";

export function PropertyFormManager({ 
  property, 
  isArchived = false,
  children 
}: PropertyFormManagerProps) {
  // Get all the form state and handlers
  const formManager = usePropertyFormManagerState(property, isArchived);
  
  // Get the wrapper method for archived properties
  const { wrapMethod } = usePropertyActionWrapper(isArchived);

  // Wrap all modification methods when property is archived
  const wrappedMethods = {
    handleFieldChange: wrapMethod(formManager.handleFieldChange),
    handleSaveObjectId: wrapMethod(formManager.handleSaveObjectId),
    handleSaveAgent: isArchived ? formManager.handleSaveAgent : wrapMethod(formManager.handleSaveAgent), // Allow agent changes even when archived
    addFeature: wrapMethod(formManager.addFeature),
    removeFeature: wrapMethod(formManager.removeFeature),
    updateFeature: wrapMethod(formManager.updateFeature),
    addArea: wrapMethod(formManager.addArea),
    removeArea: wrapMethod(formManager.removeArea),
    updateArea: wrapMethod(formManager.updateArea),
    handleAreaImageRemove: wrapMethod(formManager.handleAreaImageRemove),
    handleAreaImagesSelect: wrapMethod(formManager.handleAreaImagesSelect),
    handleAreaImageUpload: wrapMethod(formManager.handleAreaImageUpload),
    handleImageUpload: wrapMethod(formManager.handleImageUpload),
    handleRemoveImage: wrapMethod(formManager.handleRemoveImage),
    handleAreaPhotosUpload: wrapMethod(formManager.handleAreaPhotosUpload),
    handleRemoveAreaPhoto: wrapMethod(formManager.handleRemoveAreaPhoto),
    handleFloorplanUpload: wrapMethod(formManager.handleFloorplanUpload),
    handleRemoveFloorplan: wrapMethod(formManager.handleRemoveFloorplan),
    handleSetFeaturedImage: wrapMethod(formManager.handleSetFeaturedImage),
    handleToggleFeaturedImage: wrapMethod(formManager.handleToggleFeaturedImage),
    handleVirtualTourUpdate: wrapMethod(formManager.handleVirtualTourUpdate),
    handleYoutubeUrlUpdate: wrapMethod(formManager.handleYoutubeUrlUpdate),
    handleFloorplanEmbedScriptUpdate: wrapMethod(formManager.handleFloorplanEmbedScriptUpdate),
    onSubmit: wrapMethod(formManager.onSubmit),
    onFetchLocationData: wrapMethod(formManager.onFetchLocationData),
    onGenerateLocationDescription: wrapMethod(formManager.onGenerateLocationDescription),
    onGenerateMap: wrapMethod(formManager.onGenerateMap),
    onRemoveNearbyPlace: wrapMethod(formManager.onRemoveNearbyPlace),
    onFetchCategoryPlaces: wrapMethod(formManager.onFetchCategoryPlaces),
    onFetchNearbyCities: wrapMethod(formManager.onFetchNearbyCities),
    setPendingChanges: wrapMethod(formManager.setPendingChanges),
  };

  // Use the original methods or the wrapped methods based on the archived status
  const methods = isArchived ? wrappedMethods : {
    ...formManager,
    // Backward compatibility aliases
    onAddFeature: formManager.addFeature,
    onRemoveFeature: formManager.removeFeature,
    onUpdateFeature: formManager.updateFeature,
    onAddArea: formManager.addArea,
    onRemoveArea: formManager.removeArea,
    onUpdateArea: formManager.updateArea,
    onAreaImageRemove: formManager.handleAreaImageRemove,
    onAreaImagesSelect: formManager.handleAreaImagesSelect,
  };

  return children({
    ...methods,
    // Add backward compatibility aliases if using the original methods
    onAddFeature: methods.addFeature,
    onRemoveFeature: methods.removeFeature,
    onUpdateFeature: methods.updateFeature,
    onAddArea: methods.addArea,
    onRemoveArea: methods.removeArea,
    onUpdateArea: methods.updateArea,
    onAreaImageRemove: methods.handleAreaImageRemove,
    onAreaImagesSelect: methods.handleAreaImagesSelect,
    images: methods.images,
  });
}
