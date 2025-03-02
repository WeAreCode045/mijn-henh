
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { prepareFloorplansForFormSubmission } from "../../property-form/preparePropertyData";
import { useFloorplanDatabase } from "./useFloorplanDatabase";
import { useFloorplanStorage } from "./useFloorplanStorage";

export function useFloorplanUploadHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const { addFloorplanToDatabase, updatePropertyFloorplans } = useFloorplanDatabase();
  const { uploadFloorplanFile } = useFloorplanStorage();

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

  return {
    handleFloorplanUpload
  };
}
