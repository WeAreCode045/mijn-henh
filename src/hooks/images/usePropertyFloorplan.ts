
import { useState } from "react";
import { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyFloorplan(
  formData: PropertyFormData,
  setFormData: (formData: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);

  // Function to handle floorplan upload
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Process each uploaded file
      const files = Array.from(e.target.files);
      
      // Create temporary URLs for preview before upload completes
      const tempFloorplans = files.map(file => ({
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: URL.createObjectURL(file),
        sort_order: 0,
        type: "floorplan" as const
      }));
      
      // Update form data with temporary floorplans
      const currentFloorplans = Array.isArray(formData.floorplans) ? formData.floorplans : [];
      setFormData({
        ...formData,
        floorplans: [...currentFloorplans, ...tempFloorplans]
      });
      
      // Upload files to storage
      const uploadedFloorplans: PropertyFloorplan[] = [];
      
      for (const file of files) {
        // Create a unique file name
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `properties/${formData.id || 'temp'}/floorplans/${fileName}`;
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (error) {
          console.error('Error uploading floorplan:', error);
          continue;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        if (urlData) {
          uploadedFloorplans.push({
            id: `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            url: urlData.publicUrl,
            sort_order: 0,
            type: "floorplan" as const
          });
        }
      }
      
      // If property exists in database, save floorplans to the property_images table
      if (formData.id) {
        for (const floorplan of uploadedFloorplans) {
          await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              url: floorplan.url,
              type: 'floorplan',
              sort_order: floorplan.sort_order
            });
        }
      }
      
      // Replace temporary floorplans with the uploaded ones
      const updatedFloorplans = currentFloorplans.filter(fp => {
        const fpUrl = typeof fp === 'string' ? fp : fp.url;
        return !tempFloorplans.some(temp => temp.url === fpUrl);
      });
      
      // Update form data with the final floorplans
      setFormData({
        ...formData,
        floorplans: [...updatedFloorplans, ...uploadedFloorplans]
      });
      
    } catch (error) {
      console.error('Error in floorplan upload process:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle removing a floorplan
  const handleRemoveFloorplan = async (index: number) => {
    if (!formData.floorplans || !Array.isArray(formData.floorplans)) return;
    
    const floorplanToRemove = formData.floorplans[index];
    const floorplanUrl = typeof floorplanToRemove === 'string' 
      ? floorplanToRemove
      : floorplanToRemove.url;
      
    // Update form data to remove the floorplan
    const updatedFloorplans = [...formData.floorplans];
    updatedFloorplans.splice(index, 1);
    
    setFormData({
      ...formData,
      floorplans: updatedFloorplans
    });
    
    // If property exists in database, delete the floorplan record
    if (formData.id) {
      try {
        // Delete from property_images table
        await supabase
          .from('property_images')
          .delete()
          .eq('property_id', formData.id)
          .eq('url', floorplanUrl)
          .eq('type', 'floorplan');
          
        // If we have a file path, try to delete from storage
        if (typeof floorplanToRemove !== 'string' && floorplanToRemove.filePath) {
          await supabase.storage
            .from('properties')
            .remove([floorplanToRemove.filePath]);
        }
      } catch (error) {
        console.error('Error deleting floorplan:', error);
      }
    }
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploading
  };
}
