import { useState } from "react";
import { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Helper function to get the next sort order
  const getNextSortOrder = async (propertyId: string): Promise<number> => {
    // Get the highest current sort_order for floorplans
    const { data, error } = await supabase
      .from('property_images')
      .select('sort_order')
      .eq('property_id', propertyId)
      .eq('type', 'floorplan')
      .order('sort_order', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error('Error getting max sort order:', error);
      return 1; // Default to 1 if there's an error
    }
    
    // If no data or no sort_order, start with 1
    if (!data || data.length === 0 || !data[0].sort_order) {
      return 1;
    }
    
    // Otherwise, use the next number
    return data[0].sort_order + 1;
  };

  // Handle floorplan upload
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file, index) => {
        // Sanitize the file name
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        
        // Create a unique file name
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        
        // Define the file path in the storage bucket
        const filePath = `properties/${formData.id || 'new'}/floorplans/${fileName}`;
        
        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        // Return a new PropertyFloorplan object
        return {
          id: crypto.randomUUID(),
          url: publicUrl,
          filePath,
          columns: 12,  // Default column width
          title: fileName.split('-').pop() || 'Floorplan',
          sort_order: 0 // Temporary value, will be updated later
        };
      });
      
      // Wait for all uploads to complete
      const newFloorplans = await Promise.all(uploadPromises);
      
      // Create a new array with all existing and new floorplans
      const currentFloorplans = Array.isArray(formData.floorplans) ? formData.floorplans : [];
      const updatedFloorplans = [...currentFloorplans, ...newFloorplans];
      
      // Update form state
      setFormData({
        ...formData,
        floorplans: updatedFloorplans
      });
      
      // If the property is already saved in the database, update it immediately
      if (formData.id) {
        try {
          // Get the next sort order to use
          let nextSortOrder = await getNextSortOrder(formData.id);
          
          // Add floorplans to the property_images table for tracking
          for (const floorplan of newFloorplans) {
            const { error } = await supabase
              .from('property_images')
              .insert({
                property_id: formData.id,
                url: floorplan.url,
                type: 'floorplan',
                sort_order: nextSortOrder++ // Assign and increment
              });
              
            if (error) {
              console.error('Error adding floorplan to database:', error);
            }
          }
        } catch (error) {
          console.error('Exception updating floorplans in database:', error);
        }
      }
      
      toast({
        title: "Success",
        description: `${newFloorplans.length} floorplan${newFloorplans.length === 1 ? '' : 's'} uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading floorplans:', error);
      toast({
        title: "Error",
        description: "Failed to upload floorplans",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle floorplan removal
  const handleRemoveFloorplan = async (index: number) => {
    // Ensure floorplans array exists
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      console.error('Invalid floorplan index or floorplans array is not defined');
      return;
    }
    
    // Get the floorplan to be removed
    const floorplanToRemove = formData.floorplans[index];
    
    // Create a copy of the floorplans array without the removed floorplan
    const updatedFloorplans = formData.floorplans.filter((_, i) => i !== index);
    
    // Update the form state
    setFormData({
      ...formData,
      floorplans: updatedFloorplans
    });
    
    // If the floorplan has a file path, attempt to delete it from storage
    if (floorplanToRemove.filePath) {
      try {
        const { error } = await supabase.storage
          .from('properties')
          .remove([floorplanToRemove.filePath]);
          
        if (error) {
          console.error('Error deleting floorplan from storage:', error);
        }
      } catch (error) {
        console.error('Error in file deletion process:', error);
      }
    }
    
    // If property exists in database, delete the floorplan from property_images table
    if (formData.id && floorplanToRemove.url) {
      try {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('url', floorplanToRemove.url)
          .eq('property_id', formData.id);
          
        if (error) {
          console.error('Error removing floorplan from database:', error);
        }
      } catch (error) {
        console.error('Error removing floorplan from database:', error);
      }
    }
    
    toast({
      title: "Success",
      description: "Floorplan removed successfully",
    });
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan: isUploading
  };
}
