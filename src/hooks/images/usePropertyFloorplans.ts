
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { prepareFloorplansForFormSubmission } from "../property-form/preparePropertyData";
import { useFloorplanDatabase } from "./floorplans/useFloorplanDatabase";
import { useFloorplanStorage } from "./floorplans/useFloorplanStorage";
import { useFloorplanEmbed } from "./floorplans/useFloorplanEmbed";

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const { addFloorplanToDatabase, removeFloorplanFromDatabase, updatePropertyFloorplans } = useFloorplanDatabase();
  const { uploadFloorplanFile, deleteFloorplanFile } = useFloorplanStorage();
  const { handleUpdateFloorplanEmbedScript } = useFloorplanEmbed(formData, setFormData);

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (!e.target.files?.length) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const uploadResult = await uploadFloorplanFile(file, formData.id || 'new');
        
        if (!uploadResult.success) throw new Error("Failed to upload file");

        return {
          id: crypto.randomUUID(), // Generate a unique ID for the floorplan
          url: uploadResult.url,
          filePath: uploadResult.filePath, // Store the file path for deletion later
          columns: 1 // Default to 1 column
        };
      });

      const newFloorplans = await Promise.all(uploadPromises);
      
      // Ensure floorplans is an array
      const currentFloorplans = Array.isArray(formData.floorplans) ? [...formData.floorplans] : [];
      
      // Create a completely new array for React state detection
      const updatedFloorplans = [...currentFloorplans, ...newFloorplans];
      
      // Log floorplans before and after update for debugging
      console.log("Before update - floorplans:", currentFloorplans);
      console.log("After update - floorplans:", updatedFloorplans);
      
      // Create a completely new object for React state detection
      const updatedFormData = {
        ...formData,
        floorplans: updatedFloorplans
      };
      
      setFormData(updatedFormData);
      
      // If the property is already saved in the database, update it immediately
      if (formData.id) {
        try {
          // Prepare the floorplans for database update using our utility function
          const floorplansForDb = prepareFloorplansForFormSubmission(updatedFloorplans);
          
          console.log("Updating database with new floorplans:", floorplansForDb);
          
          // Update the database directly
          const updateSuccess = await updatePropertyFloorplans(formData.id, floorplansForDb);
            
          if (!updateSuccess) {
            toast({
              title: "Warning", 
              description: "Floorplans uploaded but database update failed. Please save the property.",
              variant: "destructive"
            });
          } else {
            console.log("Database updated successfully with new floorplans");
            
            // Add floorplans to property_images table for proper tracking
            for (const floorplan of newFloorplans) {
              await addFloorplanToDatabase(formData.id, floorplan);
            }
          }
        } catch (error) {
          console.error('Exception updating floorplans in database after upload:', error);
        }
      }

      toast({
        title: "Success",
        description: "Floorplans uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading floorplans:', error);
      toast({
        title: "Error",
        description: "Failed to upload floorplans",
        variant: "destructive",
      });
    }
  };

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
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleUpdateFloorplanEmbedScript
  };
}
