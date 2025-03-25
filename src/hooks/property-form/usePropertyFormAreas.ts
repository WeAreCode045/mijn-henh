import { useState, useCallback } from "react";
import { PropertyFormData, PropertyArea, PropertyImage, AreaImage } from "@/types/property";
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
      size: "",
      areaImages: [] // New field for the updated format
    };
    
    const updatedAreas = [...areas, newArea];
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
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
      if (area.id === areaId) {
        // Update using the new format
        const updatedAreaImages = area.areaImages
          ? area.areaImages.filter(img => img.ImageID !== imageId)
          : [];
          
        // For backward compatibility
        const updatedImageIds = area.imageIds 
          ? area.imageIds.filter(id => id !== imageId) 
          : [];
          
        const updatedImages = area.images
          ? area.images.filter(image => {
              if (typeof image === 'string') return image !== imageId;
              if (typeof image === 'object' && 'id' in image) return image.id !== imageId;
              return true;
            })
          : [];
        
        return {
          ...area,
          areaImages: updatedAreaImages,
          imageIds: updatedImageIds,
          images: updatedImages
        };
      }
      return area;
    });
    
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    if (formState.id) {
      console.log(`Auto-saving areas for property ${formState.id}`);
      
      autosaveField(formState.id, "areas", updatedAreas)
        .then(success => {
          if (success) {
            console.log(`Image ${imageId} removed from area ${areaId} successfully`);
            
            supabase
              .from('property_images')
              .update({ area: null })
              .eq('id', imageId)
              .eq('property_id', formState.id)
              .then(({ error }) => {
                if (error) {
                  console.error("Error updating property_images:", error);
                } else {
                  console.log("Property image record updated successfully");
                }
              });
          }
        })
        .catch(error => console.error("Error auto-saving areas:", error));
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField]);
  
  const handleAreaImagesSelect = useCallback(async (areaId: string, imageIds: string[]) => {
    if (!formState.areas || !formState.id) {
      console.error("Cannot select images: missing areas or property ID");
      return;
    }
    
    console.log(`Selecting images for area ${areaId}:`, imageIds);
    
    try {
      const areaToUpdate = formState.areas.find(area => area.id === areaId);
      if (!areaToUpdate) {
        console.error(`Area ${areaId} not found`);
        return;
      }
      
      // Create area images with the new format with proper sort order
      const areaImages: AreaImage[] = imageIds.map((id, index) => ({
        ImageID: id,
        imageSortOrder: index + 1
      }));
      
      // Convert image strings to PropertyImage objects for backward compatibility
      const selectedImages: PropertyImage[] = [];
      
      if (formState.images) {
        // Find all images matching the provided ids
        for (const imageId of imageIds) {
          // Find the image in the formState.images
          const matchingImage = formState.images.find(img => {
            if (typeof img === 'string') return img === imageId;
            return img.id === imageId;
          });
          
          if (matchingImage) {
            // Convert string to PropertyImage object if needed
            if (typeof matchingImage === 'string') {
              selectedImages.push({ id: matchingImage, url: matchingImage });
            } else {
              selectedImages.push(matchingImage as PropertyImage);
            }
          }
        }
      }
      
      console.log(`Found ${selectedImages.length} selected images:`, selectedImages);
      
      const updatedAreas = formState.areas.map(area => {
        if (area.id === areaId) {
          return {
            ...area,
            areaImages: areaImages, // New format
            images: selectedImages, // For backward compatibility
            imageIds: imageIds // For backward compatibility
          };
        }
        return area;
      });
      
      handleFieldChange("areas", updatedAreas);
      setPendingChanges(true);
      
      const areasForDb = updatedAreas.map(area => ({
        id: area.id,
        title: area.title || '',
        description: area.description || '',
        name: area.name || '',
        size: area.size || '',
        areaImages: area.areaImages || [],
        imageIds: area.imageIds || [],
        columns: area.columns || 2
      }));
      
      const { error: updateError } = await supabase
        .from('properties')
        .update({ areas: areasForDb })
        .eq('id', formState.id);
        
      if (updateError) {
        console.error('Error updating areas in properties table:', updateError);
        toast({
          title: "Error",
          description: "Failed to save area images to database",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Successfully updated areas in properties table');
      
      const { error: clearError } = await supabase
        .from('property_images')
        .update({ area: null })
        .eq('property_id', formState.id)
        .in('id', imageIds);
        
      if (clearError) {
        console.error(`Error clearing area assignments for area ${areaId}:`, clearError);
      }
      
      const updatePromises = imageIds.map((imageId, index) => 
        supabase
          .from('property_images')
          .update({ 
            area: areaId,
            sort_order: index 
          })
          .eq('id', imageId)
          .eq('property_id', formState.id)
      );
      
      const results = await Promise.all(updatePromises);
      const errors = results.filter(res => res.error).map(res => res.error);
      
      if (errors.length > 0) {
        console.error(`Errors updating property_images:`, errors);
        toast({
          title: "Warning",
          description: "Some image assignments could not be saved",
          variant: "destructive",
        });
      } else {
        console.log(`Updated ${imageIds.length} images in property_images table`);
        toast({
          title: "Success",
          description: `Area images updated successfully (${imageIds.length} images)`,
        });
      }
    } catch (error) {
      console.error("Error in handleAreaImagesSelect:", error);
      toast({
        title: "Error",
        description: "Failed to save area images",
        variant: "destructive",
      });
    }
  }, [formState.areas, formState.images, formState.id, handleFieldChange, setPendingChanges, autosaveField, toast]);
  
  const handleReorderAreaImages = useCallback(async (areaId: string, reorderedImageIds: string[]) => {
    if (!formState.areas || !formState.id) {
      console.error("Cannot reorder images: missing areas or property ID");
      return;
    }
    
    console.log(`Reordering images for area ${areaId}:`, reorderedImageIds);
    
    try {
      const areaToUpdate = formState.areas.find(area => area.id === areaId);
      if (!areaToUpdate) {
        console.error(`Area ${areaId} not found`);
        return;
      }
      
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
      
      const areasForDb = updatedAreas.map(area => ({
        id: area.id,
        title: area.title || '',
        description: area.description || '',
        name: area.name || '',
        size: area.size || '',
        imageIds: area.imageIds || [],
        columns: area.columns || 2
      }));
      
      const { error: updateError } = await supabase
        .from('properties')
        .update({ areas: areasForDb })
        .eq('id', formState.id);
        
      if (updateError) {
        console.error('Error updating areas in properties table:', updateError);
        toast({
          title: "Error",
          description: "Failed to update image order in database",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Successfully updated areas in properties table with new image order');
      
      const updatePromises = reorderedImageIds.map((imageId, index) => 
        supabase
          .from('property_images')
          .update({ sort_order: index })
          .eq('id', imageId)
          .eq('property_id', formState.id)
          .eq('area', areaId)
      );
      
      const results = await Promise.all(updatePromises);
      const errors = results.filter(res => res.error).map(res => res.error);
      
      if (errors.length > 0) {
        console.error(`Errors updating image sort orders:`, errors);
        toast({
          title: "Warning",
          description: "Some image orders could not be saved",
          variant: "destructive",
        });
      } else {
        console.log(`Updated sort orders for ${reorderedImageIds.length} images`);
        toast({
          title: "Success",
          description: "Image order updated successfully",
        });
      }
    } catch (error) {
      console.error("Error in handleReorderAreaImages:", error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField, toast]);
  
  const handleAreaImageUpload = useCallback(async (areaId: string, files: FileList) => {
    if (!formState.areas) return;
    
    setIsUploading(true);
    
    try {
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
    handleAreaPhotosUpload: handleAreaImageUpload,
    handleRemoveAreaPhoto: handleAreaImageRemove
  };
}
