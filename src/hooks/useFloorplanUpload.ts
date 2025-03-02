
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFloorplan, PropertyFormData } from "@/types/property";

export function useFloorplanUpload(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // This function handles file uploads for floorplans
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        // Sanitize the file name to remove non-ASCII characters
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        
        // Create a unique file name with UUID to prevent collisions
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        
        // Define the file path in the storage bucket - Using floorplans subfolder
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
          filePath, // Store the file path for potential deletion later
          columns: 1
        };
      });
      
      // Wait for all uploads to complete
      const newFloorplans = await Promise.all(uploadPromises);
      
      // Create a new array with all existing and new floorplans
      // Ensure floorplans is an array even if it's not defined in formData
      const currentFloorplans = Array.isArray(formData.floorplans) ? formData.floorplans : [];
      const updatedFloorplans = [...currentFloorplans, ...newFloorplans];
      
      // Log for debugging
      console.log("Previous floorplans:", currentFloorplans);
      console.log("New floorplans:", newFloorplans);
      console.log("Updated floorplans:", updatedFloorplans);
      
      // Create a completely new object for React state detection
      const updatedFormData = {
        ...formData,
        floorplans: updatedFloorplans
      };
      
      // Update form state
      setFormData(updatedFormData);
      
      // If the property exists in the database, save floorplans immediately
      if (formData.id) {
        // Add floorplans to the property_images table for tracking
        for (const floorplan of newFloorplans) {
          const { error } = await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              url: floorplan.url,
              type: 'floorplan' // Set type as 'floorplan' to distinguish from images
            });
            
          if (error) {
            console.error('Error adding floorplan to database:', error);
          }
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

  // This function handles the removal of floorplans
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
    
    // Create an updated form data object
    const updatedFormData = {
      ...formData,
      floorplans: updatedFloorplans
    };
    
    // Update the form state
    setFormData(updatedFormData);
    
    // Attempt to delete the file from storage if file path exists
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
    
    // If property exists in database, update the property_images table
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

  // Handle updating the floorplan embed script
  const handleUpdateFloorplanEmbedScript = (script: string) => {
    setFormData({
      ...formData,
      floorplanEmbedScript: script
    });
  };

  // When fetching floorplans, get them from property_images table and filter to only floorplans
  const fetchFloorplans = async (propertyId: string) => {
    if (!propertyId) return [];
    
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan') // Only get 'floorplan' type
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform to PropertyFloorplan format
      const floorplans: PropertyFloorplan[] = (data || []).map(item => ({
        id: item.id,
        url: item.url,
        columns: 1
      }));
      
      return floorplans;
    } catch (error) {
      console.error('Error fetching property floorplans:', error);
      return [];
    }
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplanEmbedScript,
    isUploading,
    fetchFloorplans,
    floorplans: formData?.floorplans || []
  };
}
