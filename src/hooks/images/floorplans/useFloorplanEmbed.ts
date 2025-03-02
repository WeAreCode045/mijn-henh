
import type { PropertyFormData } from "@/types/property";

export function useFloorplanEmbed(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const handleUpdateFloorplanEmbedScript = (script: string) => {
    console.log("Updating floorplan embed script:", script);
    
    // Create a completely new object to ensure React detects the state change
    const updatedFormData = {
      ...formData,
      floorplanEmbedScript: script
    };
    
    setFormData(updatedFormData);
  };

  return {
    handleUpdateFloorplanEmbedScript
  };
}
