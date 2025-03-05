import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyFloorplan } from '@/types/property';
import { Floorplan } from '@/components/property/form/steps/technical-data/FloorplanUpload';

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Handle floorplan image upload
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
          filePath,
          title: 'Floorplan', // Add default title
          columns: 2 // Default to 2 columns
        };
      });
      
      // Wait for all uploads to complete
      const newFloorplans = await Promise.all(uploadPromises);
      
      // Create a new array with all existing and new floorplans
      const currentFloorplans = Array.isArray(formData.floorplans) ? formData.floorplans : [];
      const updatedFloorplans = [...currentFloorplans, ...newFloorplans];
      
      // Log for debugging
      console.log("Previous floorplans:", currentFloorplans);
      console.log("New floorplans:", newFloorplans);
      console.log("Updated floorplans:", updatedFloorplans);
      
      // Update form state
      setFormData({
        ...formData,
        floorplans: updatedFloorplans
      });
      
      // If the property is already saved in the database, update it immediately
      if (formData.id) {
        try {
          // Add floorplans to the property_images table for tracking
          for (const floorplan of newFloorplans) {
            const { error } = await supabase
              .from('property_images')
              .insert({
                property_id: formData.id,
                url: floorplan.url,
                type: 'floorplan', // Set type as 'floorplan' to distinguish from regular images
                title: floorplan.title // Add title to the database
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

  // Remove a floorplan
  const handleRemoveFloorplan = async (index: number) => {
    try {
      const floorplanToRemove = formData.floorplans?.[index];
      if (!floorplanToRemove) return;
      
      // Create a new array without the floorplan to remove
      const updatedFloorplans = formData.floorplans?.filter((_, i) => i !== index) || [];
      
      // Update form state
      setFormData({
        ...formData,
        floorplans: updatedFloorplans
      });
      
      // If the property is already saved in the database and we have the floorplan's url, delete it
      if (formData.id && floorplanToRemove.url) {
        try {
          // Remove the floorplan from the property_images table
          const { error } = await supabase
            .from('property_images')
            .delete()
            .eq('property_id', formData.id)
            .eq('url', floorplanToRemove.url)
            .eq('type', 'floorplan');
            
          if (error) {
            console.error('Error removing floorplan from database:', error);
          }
          
          // If we have a file path, delete the file from storage
          if (floorplanToRemove.filePath) {
            const { error: storageError } = await supabase.storage
              .from('properties')
              .remove([floorplanToRemove.filePath]);
              
            if (storageError) {
              console.error('Error removing floorplan from storage:', storageError);
            }
          }
        } catch (error) {
          console.error('Exception deleting floorplan:', error);
        }
      }
      
      toast({
        title: "Success",
        description: "Floorplan removed successfully",
      });
    } catch (error) {
      console.error('Error removing floorplan:', error);
      toast({
        title: "Error",
        description: "Failed to remove floorplan",
        variant: "destructive",
      });
    }
  };

  // Update a floorplan's properties
  const handleUpdateFloorplan = (index: number, field: keyof Floorplan, value: any) => {
    if (!formData.floorplans) return;
    
    const updatedFloorplans = [...formData.floorplans];
    updatedFloorplans[index] = {
      ...updatedFloorplans[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      floorplans: updatedFloorplans
    });
    
    // If property exists in database and field is "columns", update the property_images record
    if (formData.id && field === "columns" && updatedFloorplans[index].url) {
      try {
        // We currently don't have a columns field in property_images, so we'd need to implement this later
        // This would require a schema update to add a columns field to property_images
        console.log("Floorplan columns updated in local state only; database schema update needed to persist this");
      } catch (error) {
        console.error('Error updating floorplan columns in database:', error);
      }
    }
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    isUploading
  };
}
