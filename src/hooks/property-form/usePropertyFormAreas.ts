
import { useState, useCallback } from "react";
import { PropertyFormData, PropertyArea } from "@/types/property";

export function usePropertyFormAreas(
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setPendingChanges: (pending: boolean) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  
  const addArea = useCallback(() => {
    const areas = formState.areas || [];
    const newArea: PropertyArea = {
      id: `area-${Date.now()}`,
      name: `Area ${areas.length + 1}`,
      description: "",
      photos: []
    };
    
    handleFieldChange("areas", [...areas, newArea]);
    setPendingChanges(true);
  }, [formState.areas, handleFieldChange, setPendingChanges]);
  
  const removeArea = useCallback((areaId: string) => {
    if (!formState.areas) return;
    
    const updatedAreas = formState.areas.filter(area => area.id !== areaId);
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
  }, [formState.areas, handleFieldChange, setPendingChanges]);
  
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
  }, [formState.areas, handleFieldChange, setPendingChanges]);
  
  const handleAreaImageRemove = useCallback((areaId: string, imageId: string) => {
    if (!formState.areas) return;
    
    const updatedAreas = formState.areas.map(area => {
      if (area.id === areaId && area.photos) {
        return {
          ...area,
          photos: area.photos.filter(photo => photo.id !== imageId)
        };
      }
      return area;
    });
    
    handleFieldChange("areas", updatedAreas);
    setPendingChanges(true);
  }, [formState.areas, handleFieldChange, setPendingChanges]);
  
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
      // Mock implementation
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
