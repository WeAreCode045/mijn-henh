
import { PropertyFormData, PropertyFloorplan } from "@/types/property";

export function useFloorplanUpdateHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const handleUpdateFloorplan = (index: number, field: keyof PropertyFloorplan, value: any) => {
    console.log(`Updating floorplan at index ${index}, field ${String(field)}, value:`, value);
    
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      console.error('Invalid floorplan index or floorplans array is not defined');
      return;
    }
    
    // Create a new copy of the floorplans array
    const updatedFloorplans = [...formData.floorplans];
    updatedFloorplans[index] = {
      ...updatedFloorplans[index],
      [field]: value
    };
    
    // Create a completely new object to ensure React detects the state change
    const updatedFormData = {
      ...formData,
      floorplans: updatedFloorplans
    };
    
    setFormData(updatedFormData);
  };

  return {
    handleUpdateFloorplan
  };
}
