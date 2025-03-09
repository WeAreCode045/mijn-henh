import { useState } from "react";
import { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploadingFloorplan, setIsUploadingFloorplan] = useState(false);

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploadingFloorplan(true);
    const files = Array.from(e.target.files);
    const newFloorplans: PropertyFloorplan[] = [];

    try {
      const currentFloorplans = Array.isArray(formData.floorplans) ? formData.floorplans : [];
      
      // Find the highest sort_order for floorplans
      let highestSortOrder = 0;
      
      // First check the current state floorplans
      currentFloorplans.forEach(floorplan => {
        if (typeof floorplan === 'object' && floorplan.sort_order && floorplan.sort_order > highestSortOrder) {
          highestSortOrder = floorplan.sort_order;
        }
      });
      
      // If we have a property ID, also check the database for the highest sort_order
      if (formData.id) {
        const { data, error } = await supabase
          .from('property_images')
          .select('sort_order')
          .eq('property_id', formData.id)
          .eq('type', 'floorplan')
          .order('sort_order', { ascending: false })
          .limit(1);
          
        if (!error && data && data.length > 0 && data[0].sort_order) {
          highestSortOrder = Math.max(highestSortOrder, data[0].sort_order);
        }
      }

      console.log("Starting upload for", files.length, "floorplan files. Property ID:", formData.id);

      // Process each file
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = formData.id 
          ? `properties/${formData.id}/floorplans/${fileName}`
          : `temp/floorplans/${fileName}`;

        console.log("Uploading floorplan file to path:", filePath);

        // Upload to storage - CORRECTED BUCKET NAME
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading floorplan:', uploadError);
          toast.error(`Error uploading floorplan: ${uploadError.message}`);
          continue;
        }

        // Get public URL - CORRECTED BUCKET NAME
        const { data: publicUrlData } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Could not get public URL for floorplan');
          continue;
        }

        console.log("Floorplan file uploaded successfully, public URL:", publicUrlData.publicUrl);

        // Increment the sort_order for each new floorplan
        highestSortOrder += 1;

        // Create floorplan record in database if we have a property ID
        if (formData.id) {
          console.log("Creating database record for floorplan with property_id:", formData.id);
          const { error: dbError, data: floorplanData } = await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              type: 'floorplan',
              url: publicUrlData.publicUrl,
              sort_order: highestSortOrder // Assign sort_order
            })
            .select()
            .single();

          if (dbError) {
            console.error('Error recording floorplan in database:', dbError);
            toast.error(`Error saving floorplan reference: ${dbError.message}`);
          } else {
            console.log("Database record created successfully:", floorplanData);
            
            // Use the returned database ID if available
            newFloorplans.push({
              id: floorplanData.id || Date.now().toString() + Math.random().toString(),
              url: publicUrlData.publicUrl,
              sort_order: highestSortOrder
            });
          }
        } else {
          // If no property ID, just use a temporary ID
          newFloorplans.push({
            id: Date.now().toString() + Math.random().toString(),
            url: publicUrlData.publicUrl,
            sort_order: highestSortOrder
          });
        }
      }

      // Update form data with new floorplans
      console.log("Adding new floorplans to form state:", newFloorplans);
      setFormData({
        ...formData,
        floorplans: [...currentFloorplans, ...newFloorplans]
      });
      
      if (newFloorplans.length > 0) {
        toast.success(`${newFloorplans.length} floorplan${newFloorplans.length > 1 ? 's' : ''} uploaded successfully`);
      }
      
    } catch (error) {
      console.error('Error in floorplan upload:', error);
      toast.error('Error uploading floorplans. Please try again.');
    } finally {
      setIsUploadingFloorplan(false);
    }
  };

  const handleRemoveFloorplan = async (index: number) => {
    // Ensure floorplans array exists
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      console.error('Invalid floorplan index or floorplans array is not defined');
      return;
    }
    
    // Get the floorplan to be removed
    const floorplanToRemove = formData.floorplans[index];
    const floorplanUrl = typeof floorplanToRemove === 'string' ? floorplanToRemove : floorplanToRemove.url;
    const floorplanId = typeof floorplanToRemove === 'string' ? null : floorplanToRemove.id;
    
    if (!formData.id) {
      // If we don't have a property ID yet, just update the local state
      // Create a copy of the floorplans array without the removed floorplan
      const updatedFloorplans = formData.floorplans.filter((_, i) => i !== index);
      
      // Create an updated form data object
      const updatedFormData = {
        ...formData,
        floorplans: updatedFloorplans
      };
      
      // Update the form state
      setFormData(updatedFormData);
      
      toast.success("Floorplan removed successfully");
      return;
    }
    
    try {
      // If we have a property ID and URL, delete the floorplan from the database
      if (formData.id && floorplanUrl) {
        console.log("Deleting floorplan from database:", { floorplanUrl, floorplanId, propertyId: formData.id });
        
        // First fetch the floorplan record to get the file path from the URL
        let filePath;
        
        if (floorplanId) {
          // Attempt to delete from property_images table
          const { error: deleteError } = await supabase
            .from('property_images')
            .delete()
            .eq('id', floorplanId);
            
          if (deleteError) {
            console.error('Error deleting floorplan record from database:', deleteError);
            throw deleteError;
          }
        } else {
          // If we don't have an ID, try to delete by URL
          const { error: deleteError } = await supabase
            .from('property_images')
            .delete()
            .eq('url', floorplanUrl)
            .eq('property_id', formData.id);
            
          if (deleteError) {
            console.error('Error deleting floorplan record from database by URL:', deleteError);
            throw deleteError;
          }
        }
        
        // Try to extract the file path from the URL
        try {
          const urlObj = new URL(floorplanUrl);
          const pathname = urlObj.pathname;
          // The path should be something like /storage/v1/object/public/properties/path/to/file
          // We need to extract just the "path/to/file" part
          const pathMatch = pathname.match(/\/storage\/v1\/object\/public\/properties\/(.+)/);
          if (pathMatch && pathMatch[1]) {
            filePath = decodeURIComponent(pathMatch[1]);
            
            // Attempt to delete the file from storage
            console.log("Attempting to delete file from storage:", filePath);
            const { error: storageError } = await supabase.storage
              .from('properties')
              .remove([filePath]);
              
            if (storageError) {
              console.error('Error deleting file from storage:', storageError);
              // We don't throw here as the database record has been deleted successfully
            }
          }
        } catch (parseError) {
          console.error('Error parsing floorplan URL to get file path:', parseError);
          // Continue with state update even if storage deletion fails
        }
      }
      
      // Create a copy of the floorplans array without the removed floorplan
      const updatedFloorplans = formData.floorplans.filter((_, i) => i !== index);
      
      // Create an updated form data object
      const updatedFormData = {
        ...formData,
        floorplans: updatedFloorplans
      };
      
      // Update the form state
      setFormData(updatedFormData);
      
      // Show success toast
      toast.success("Floorplan removed successfully");
    } catch (error) {
      console.error('Error removing floorplan:', error);
      toast.error("Failed to remove floorplan. Please try again.");
    }
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  };
}
