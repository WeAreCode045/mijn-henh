
import { useState } from "react";
import { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { toPropertyFloorplan, toPropertyFloorplanArray } from "@/utils/imageTypeConverters";

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploadingFloorplan, setIsUploadingFloorplan] = useState(false);

  // Upload floorplan
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploadingFloorplan(true);
    
    try {
      // In a real implementation, this would upload the file
      // For demo, we'll just create URL objects
      const files = Array.from(e.target.files);
      const floorplanUrls = files.map(file => {
        const url = URL.createObjectURL(file);
        // Create a PropertyFloorplan object
        return toPropertyFloorplan(url);
      });
      
      // Add the uploaded floorplans to the property
      const currentFloorplans = formData.floorplans || [];
      const updatedFloorplans = [...toPropertyFloorplanArray(currentFloorplans), ...floorplanUrls];
      
      setFormData({
        ...formData,
        floorplans: updatedFloorplans
      });
    } finally {
      setIsUploadingFloorplan(false);
    }
  };

  // Remove floorplan
  const handleRemoveFloorplan = (index: number) => {
    if (!formData.floorplans) return;
    
    const updatedFloorplans = [...formData.floorplans];
    updatedFloorplans.splice(index, 1);
    
    setFormData({
      ...formData,
      floorplans: updatedFloorplans
    });
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  };
}
