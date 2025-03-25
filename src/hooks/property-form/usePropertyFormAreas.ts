
import { useState, useCallback } from "react";
import { PropertyFormData, PropertyArea } from "@/types/property";
import { usePropertyAutoSave } from "@/hooks/property-autosave";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyFormAreas(
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setPendingChanges: (pending: boolean) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const { autosaveField } = usePropertyAutoSave();
  const { toast } = useToast();
  
  const addArea = useCallback(() => {
    console.log("Adding area...");
    const areas = formState.areas || [];
    const newArea: PropertyArea = {
      id: `area-${Date.now()}`,
      name: `Area ${areas.length + 1}`,
      title: `Area ${areas.length + 1}`,
      description: "",
      images: [],
      imageIds: [],
      columns: 2,
      size: ""
    };
    
    const updatedAreas = [...areas, newArea];
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    // Auto-save the change if we have an ID
    if (formState.id) {
      toast({
        title: "Adding area...",
        description: "Saving new area to database",
      });
      
      autosaveField(formState.id, "areas", updatedAreas)
        .then(success => {
          if (success) {
            toast({
              title: "Success",
              description: "New area added and saved",
            });
          }
        })
        .catch(error => {
          console.error("Error auto-saving areas:", error);
          toast({
            title: "Error",
            description: "Failed to save new area",
            variant: "destructive",
          });
        });
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField, toast]);
  
  const removeArea = useCallback((areaId: string) => {
    if (!formState.areas) return;
    
    const updatedAreas = formState.areas.filter(area => area.id !== areaId);
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    // Auto-save the change if we have an ID
    if (formState.id) {
      toast({
        title: "Removing area...",
        description: "Saving changes to database",
      });
      
      autosaveField(formState.id, "areas", updatedAreas)
        .then(success => {
          if (success) {
            toast({
              title: "Success",
              description: "Area removed successfully",
            });
          }
        })
        .catch(error => {
          console.error("Error auto-saving areas:", error);
          toast({
            title: "Error",
            description: "Failed to remove area",
            variant: "destructive",
          });
        });
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField, toast]);
  
  const updateArea = useCallback((areaId: string, field: keyof PropertyArea, value: any) => {
    if (!formState.areas) return;
    
    console.log(`Updating area ${areaId}, field ${String(field)} with value:`, value);
    
    const updatedAreas = formState.areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          [field]: value
        };
      }
      return area;
    });
    
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    // Auto-save the change if we have an ID
    if (formState.id) {
      autosaveField(formState.id, "areas", updatedAreas)
        .then(success => {
          if (success) {
            console.log(`Area ${areaId} field ${String(field)} updated successfully`);
          } else {
            console.error(`Failed to auto-save area ${areaId} field ${String(field)}`);
          }
        })
        .catch(error => console.error("Error auto-saving areas:", error));
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField]);
  
  const handleAreaImageRemove = useCallback((areaId: string, imageId: string) => {
    if (!formState.areas) return;
    
    console.log(`Removing image ${imageId} from area ${areaId}`);
    
    const updatedAreas = formState.areas.map(area => {
      if (area.id === areaId && area.images) {
        // Filter out the removed image
        const updatedImageIds = area.imageIds ? area.imageIds.filter(id => id !== imageId) : [];
        
        return {
          ...area,
          images: area.images.filter(image => {
            if (typeof image === 'string') {
              return image !== imageId;
            }
            return image.id !== imageId;
          }),
          imageIds: updatedImageIds
        };
      }
      return area;
    });
    
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    // Auto-save the change if we have an ID
    if (formState.id) {
      autosaveField(formState.id, "areas", updatedAreas)
        .then(success => {
          if (success) {
            console.log(`Image ${imageId} removed from area ${areaId} successfully`);
            
            // Also update the property_images table to clear the area assignment
            supabase
              .from('property_images')
              .update({ area: null })
              .eq('id', imageId)
              .eq('property_id', formState.id)
              .then(({ error }) => {
                if (error) {
                  console.error("Error updating property_images:", error);
                }
              });
          }
        })
        .catch(error => console.error("Error auto-saving areas:", error));
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField]);
  
  const handleAreaImagesSelect = useCallback((areaId: string, imageIds: string[]) => {
    if (!formState.areas) return;
    
    console.log(`Selecting images for area ${areaId}:`, imageIds);
    
    // Find the area to update
    const areaToUpdate = formState.areas.find(area => area.id === areaId);
    if (!areaToUpdate) {
      console.error(`Area ${areaId} not found`);
      return;
    }
    
    // Find the images from the property images
    const selectedImages = formState.images
      ? formState.images.filter(img => {
          if (typeof img === 'string') {
            return imageIds.includes(img);
          } else if (typeof img === 'object' && 'id' in img) {
            return imageIds.includes(img.id);
          }
          return false;
        })
      : [];
    
    console.log(`Found ${selectedImages.length} selected images:`, selectedImages);
    
    // Update the area with the selected images
    const updatedAreas = formState.areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          images: selectedImages,
          imageIds: imageIds
        };
      }
      return area;
    });
    
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    // Auto-save the change if we have an ID
    if (formState.id) {
      console.log(`Auto-saving areas for property ${formState.id}`);
      
      autosaveField(formState.id, "areas", updatedAreas)
        .then(success => {
          if (success) {
            console.log(`Area ${areaId} images updated successfully with ${imageIds.length} images`);
            toast({
              title: "Success",
              description: `Area images updated successfully (${imageIds.length} images)`,
            });
            
            // Update property_images table to set area field for these images
            // First clear any existing area assignments for this area
            supabase
              .from('property_images')
              .update({ area: null })
              .eq('property_id', formState.id)
              .eq('area', areaId)
              .then(({ error }) => {
                if (error) {
                  console.error(`Error clearing area assignments for area ${areaId}:`, error);
                  return;
                }
                
                // Now set the area for each selected image
                Promise.all(imageIds.map((imageId, index) => 
                  supabase
                    .from('property_images')
                    .update({ 
                      area: areaId,
                      sort_order: index 
                    })
                    .eq('id', imageId)
                    .eq('property_id', formState.id)
                )).then(results => {
                  const errors = results.filter(res => res.error).map(res => res.error);
                  if (errors.length > 0) {
                    console.error(`Errors updating property_images:`, errors);
                  } else {
                    console.log(`Updated ${imageIds.length} images in property_images table`);
                  }
                });
              });
          } else {
            console.error(`Failed to auto-save area ${areaId} images`);
            toast({
              title: "Error",
              description: "Failed to save area images",
              variant: "destructive",
            });
          }
        })
        .catch(error => {
          console.error("Error auto-saving areas:", error);
          toast({
            title: "Error",
            description: "Failed to save area images",
            variant: "destructive",
          });
        });
    }
  }, [formState.areas, formState.images, formState.id, handleFieldChange, setPendingChanges, autosaveField, toast]);
  
  const handleReorderAreaImages = useCallback((areaId: string, reorderedImageIds: string[]) => {
    if (!formState.areas) return;
    
    console.log(`Reordering images for area ${areaId}:`, reorderedImageIds);
    
    // Find the area to update
    const areaToUpdate = formState.areas.find(area => area.id === areaId);
    if (!areaToUpdate) return;
    
    // Get all images for this area
    const areaImages = formState.images 
      ? formState.images.filter(img => {
          if (typeof img === 'string') {
            return reorderedImageIds.includes(img);
          } else if (typeof img === 'object' && 'id' in img) {
            return reorderedImageIds.includes(img.id);
          }
          return false;
        })
      : [];
    
    // Update the area with the reordered images
    const updatedAreas = formState.areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          imageIds: reorderedImageIds
        };
      }
      return area;
    });
    
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    // Auto-save the change if we have an ID
    if (formState.id) {
      autosaveField(formState.id, "areas", updatedAreas)
        .then(success => {
          if (success) {
            toast({
              title: "Success",
              description: "Image order updated",
            });
            
            // Update sort orders in property_images table
            Promise.all(reorderedImageIds.map((imageId, index) => 
              supabase
                .from('property_images')
                .update({ sort_order: index })
                .eq('id', imageId)
                .eq('property_id', formState.id)
                .eq('area', areaId)
            )).then(results => {
              const errors = results.filter(res => res.error).map(res => res.error);
              if (errors.length > 0) {
                console.error(`Errors updating image sort orders:`, errors);
              } else {
                console.log(`Updated sort orders for ${reorderedImageIds.length} images`);
              }
            });
          }
        })
        .catch(error => {
          console.error("Error auto-saving areas:", error);
          toast({
            title: "Error",
            description: "Failed to update image order",
            variant: "destructive",
          });
        });
    }
  }, [formState.areas, formState.images, formState.id, handleFieldChange, setPendingChanges, autosaveField, toast]);
  
  const handleAreaImageUpload = useCallback(async (areaId: string, files: FileList) => {
    if (!formState.areas) return;
    
    setIsUploading(true);
    
    try {
      // Implementation for uploading images for an area
      console.log("Uploading images for area:", areaId);
      
      setTimeout(() => {
        setIsUploading(false);
        setPendingChanges(true);
      }, 1000);
    } catch (error) {
      console.error("Error uploading area images:", error);
      setIsUploading(false);
    }
  }, [setPendingChanges]);
  
  const handleAreaPhotosUpload = useCallback(async (areaId: string, files: FileList) => {
    await handleAreaImageUpload(areaId, files);
  }, [handleAreaImageUpload]);
  
  const handleRemoveAreaPhoto = useCallback((areaId: string, photoId: string) => {
    handleAreaImageRemove(areaId, photoId);
  }, [handleAreaImageRemove]);
  
  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    handleReorderAreaImages,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto
  };
}
