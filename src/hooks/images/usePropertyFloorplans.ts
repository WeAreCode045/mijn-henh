
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { prepareFloorplansForFormSubmission } from "../property-form/preparePropertyData";

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (!e.target.files?.length) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/floorplans/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        return {
          id: crypto.randomUUID(), // Generate a unique ID for the floorplan
          url: publicUrl,
          filePath: filePath, // Store the file path for deletion later
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
          const { error } = await supabase
            .from('properties')
            .update({ floorplans: floorplansForDb })
            .eq('id', formData.id);
            
          if (error) {
            console.error('Error updating floorplans in database after upload:', error);
            toast({
              title: "Warning", 
              description: "Floorplans uploaded but database update failed. Please save the property.",
              variant: "destructive"
            });
          } else {
            console.log("Database updated successfully with new floorplans");
            
            // Add floorplans to property_images table for proper tracking
            for (const floorplan of newFloorplans) {
              const { error: imageError } = await supabase
                .from('property_images')
                .insert({
                  property_id: formData.id,
                  url: floorplan.url
                });
                
              if (imageError) {
                console.error('Error adding floorplan to property_images table:', imageError);
              }
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
    if (floorplanToRemove.filePath) {
      try {
        const { error } = await supabase.storage
          .from('properties')
          .remove([floorplanToRemove.filePath]);
          
        if (error) {
          console.error('Error deleting floorplan file:', error);
          // Continue with the process even if file deletion fails
        }
      } catch (err) {
        console.error('Error in file deletion process:', err);
        // Continue with the process even if file deletion fails
      }
    }
    
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
        const { error } = await supabase
          .from('properties')
          .update({ floorplans: floorplansForDb })
          .eq('id', formData.id);
          
        if (error) {
          console.error('Error updating floorplans in database:', error);
          toast({
            title: "Error", 
            description: "Failed to update database with removed floorplan",
            variant: "destructive"
          });
        } else {
          console.log("Database updated successfully with removed floorplan");
          
          // Remove the floorplan from property_images if it exists
          if (floorplanToRemove.url) {
            const { error: deleteError } = await supabase
              .from('property_images')
              .delete()
              .eq('url', floorplanToRemove.url)
              .eq('property_id', formData.id);
              
            if (deleteError) {
              console.error('Error removing floorplan from property_images table:', deleteError);
            }
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

  const handleUpdateFloorplanEmbedScript = (script: string) => {
    console.log("Updating floorplan embed script:", script);
    
    // Create a completely new object to ensure React detects the state change
    const updatedFormData = {
      ...formData,
      floorplanEmbedScript: script
    };
    
    setFormData(updatedFormData);
    
    // Log to confirm the update
    console.log("Updated formData with floorplanEmbedScript:", updatedFormData.floorplanEmbedScript);
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleUpdateFloorplanEmbedScript
  };
}
