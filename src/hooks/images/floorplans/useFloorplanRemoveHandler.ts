
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { prepareFloorplansForFormSubmission } from "../../property-form/preparePropertyData";
import { useFloorplanDatabase } from "./useFloorplanDatabase";
import { useFloorplanStorage } from "./useFloorplanStorage";

export function useFloorplanRemoveHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const { removeFloorplanFromDatabase, updatePropertyFloorplans } = useFloorplanDatabase();
  const { deleteFloorplanFile } = useFloorplanStorage();

  const handleRemoveFloorplan = async (index: number) => {
    console.log("Removing floorplan at index:", index);
    
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      console.error('Invalid floorplan index or floorplans array is not defined');
      return;
    }
    
    // Get the floorplan to remove
    const floorplanToRemove = formData.floorplans[index];
    
    // Delete the file from storage if filePath exists
    await deleteFloorplanFile(floorplanToRemove.filePath);
    
    // Update any technical items that reference this floorplan
    const updatedTechnicalItems = (formData.technicalItems || []).map(item => {
      // If this technical item references the removed floorplan
      if (item.floorplanId === floorplanToRemove.id) {
        // This technical item referenced the removed floorplan
        return { ...item, floorplanId: null };
      }
      return item;
    });
    
    // Create a new filtered floorplans array using a direct filter to ensure no references are maintained
    const updatedFloorplans = formData.floorplans.filter((_, i) => i !== index);
    
    // Log the floorplans before and after removal for debugging
    console.log("Before remove - floorplans:", formData.floorplans);
    console.log("After remove - floorplans:", updatedFloorplans);
    
    // Create a completely new object to ensure React detects the state change
    const updatedFormData = {
      ...formData,
      floorplans: updatedFloorplans,
      technicalItems: updatedTechnicalItems
    };
    
    // Set the form data immediately with the updated floorplans
    setFormData(updatedFormData);
    
    // If the property is already saved in the database, update it immediately
    if (formData.id) {
      try {
        // Prepare the data for database update using our utility function
        const floorplansForDb = prepareFloorplansForFormSubmission(updatedFloorplans);
        
        console.log("Updating database with removed floorplan, new data:", floorplansForDb);
        
        // Update the database directly
        const updateSuccess = await updatePropertyFloorplans(formData.id, floorplansForDb);
          
        if (!updateSuccess) {
          toast({
            title: "Error", 
            description: "Failed to update database with removed floorplan",
            variant: "destructive"
          });
        } else {
          console.log("Database updated successfully with removed floorplan");
          
          // Remove the floorplan from property_images if it exists
          if (floorplanToRemove.url) {
            await removeFloorplanFromDatabase(formData.id, floorplanToRemove.url);
          }
        }
      } catch (error) {
        console.error('Exception updating floorplans in database:', error);
      }
    }
    
    toast({
      title: "Success", 
      description: "Floorplan removed successfully"
    });
  };

  return {
    handleRemoveFloorplan
  };
}
