import { useState, useCallback } from "react";
import { PropertyFormData, PropertyArea } from "@/types/property";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { useToast } from "@/components/ui/use-toast";

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
        .catch(error => console.error("Error auto-saving areas:", error));
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField]);
  
  const handleAreaImageRemove = useCallback((areaId: string, imageId: string) => {
    if (!formState.areas) return;
    
    const updatedAreas = formState.areas.map(area => {
      if (area.id === areaId && area.images) {
        return {
          ...area,
          images: area.images.filter(image => {
            if (typeof image === 'string') {
              return image !== imageId;
            }
            return image.id !== imageId;
          }),
          imageIds: area.imageIds ? area.imageIds.filter(id => id !== imageId) : []
        };
      }
      return area;
    });
    
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
    
    // Auto-save the change if we have an ID
    if (formState.id) {
      autosaveField(formState.id, "areas", updatedAreas)
        .catch(error => console.error("Error auto-saving areas:", error));
    }
  }, [formState.areas, formState.id, handleFieldChange, setPendingChanges, autosaveField]);
  
  const handleAreaImagesSelect = useCallback((areaId: string, imageIds: string[]) => {
    if (!formState.areas) return;
    
    // Implementation for selecting images for an area
    console.log("Selecting images for area:", areaId, imageIds);
    setPendingChanges(true);
  }, [setPendingChanges]);
  
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
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto
  };
}
