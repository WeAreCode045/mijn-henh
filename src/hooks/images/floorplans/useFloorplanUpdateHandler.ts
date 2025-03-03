
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";

export function useFloorplanUpdateHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  const handleUpdateFloorplan = (index: number, field: keyof PropertyFloorplan, value: any) => {
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      return;
    }
    
    try {
      const updatedFloorplans = [...formData.floorplans];
      updatedFloorplans[index] = {
        ...updatedFloorplans[index],
        [field]: value
      };
      
      setFormData({
        ...formData,
        floorplans: updatedFloorplans
      });
      
      toast({
        title: "Success",
        description: `Floorplan ${field} updated successfully`
      });
    } catch (error) {
      console.error(`Error updating floorplan ${field}:`, error);
      toast({
        title: "Error",
        description: `Failed to update floorplan ${field}`,
        variant: "destructive"
      });
    }
  };

  return { handleUpdateFloorplan };
}
