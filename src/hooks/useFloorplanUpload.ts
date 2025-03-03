
import { useState } from "react";
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useFloorplanUpload(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Upload a floorplan image
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setIsUploading(true);
      
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        // Generate a unique identifier for the file
        const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^\x00-\x7F]/g, '')}`;
        const filePath = `properties/${formData.id || 'new'}/floorplans/${fileName}`;
        
        // Upload to Supabase
        const { error } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (error) {
          throw error;
        }
        
        // Get the public URL
        const { data } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        return {
          id: crypto.randomUUID(),
          url: data.publicUrl,
          filePath: filePath
        };
      });
      
      const uploadedFloorplans = await Promise.all(uploadPromises);
      
      // Update form data with new floorplans
      const updatedFloorplans = [...(formData.floorplans || []), ...uploadedFloorplans];
      setFormData({
        ...formData,
        floorplans: updatedFloorplans
      });
      
      toast({
        title: "Success",
        description: `${uploadedFloorplans.length} floorplan(s) uploaded successfully`
      });
      
      return uploadedFloorplans;
    } catch (error) {
      console.error("Error uploading floorplans:", error);
      toast({
        title: "Error",
        description: "Failed to upload floorplans",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Upload a floorplan for a specific technical item
  const handleTechnicalItemFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>, technicalItemId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setIsUploading(true);
      
      const file = e.target.files[0];
      const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^\x00-\x7F]/g, '')}`;
      const filePath = `properties/${formData.id || 'new'}/floorplans/${fileName}`;
      
      // Upload to Supabase
      const { error } = await supabase.storage
        .from('properties')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);
        
      const newFloorplan = {
        id: crypto.randomUUID(),
        url: data.publicUrl,
        filePath: filePath
      };
      
      // Update form data with new floorplan
      const updatedFloorplans = [...(formData.floorplans || []), newFloorplan];
      
      // Update the technical item to reference this floorplan
      const updatedTechnicalItems = (formData.technicalItems || []).map(item => 
        item.id === technicalItemId ? { ...item, floorplanId: newFloorplan.id } : item
      );
      
      setFormData({
        ...formData,
        floorplans: updatedFloorplans,
        technicalItems: updatedTechnicalItems
      });
      
      toast({
        title: "Success",
        description: "Floorplan uploaded and linked to technical item"
      });
      
      return newFloorplan;
    } catch (error) {
      console.error("Error uploading technical item floorplan:", error);
      toast({
        title: "Error",
        description: "Failed to upload floorplan",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove a floorplan
  const handleRemoveFloorplan = async (index: number) => {
    if (!formData.floorplans || index < 0 || index >= formData.floorplans.length) return;
    
    try {
      const floorplanToRemove = formData.floorplans[index];
      
      // Delete from storage if we have a file path
      if (floorplanToRemove.filePath) {
        await supabase.storage
          .from('properties')
          .remove([floorplanToRemove.filePath]);
      }
      
      // Update any technical items that reference this floorplan
      const updatedTechnicalItems = (formData.technicalItems || []).map(item => {
        if (item.floorplanId === floorplanToRemove.id) {
          return { ...item, floorplanId: null };
        }
        return item;
      });
      
      // Remove from form data
      const updatedFloorplans = formData.floorplans.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        floorplans: updatedFloorplans,
        technicalItems: updatedTechnicalItems
      });
      
      toast({
        title: "Success",
        description: "Floorplan removed successfully"
      });
    } catch (error) {
      console.error("Error removing floorplan:", error);
      toast({
        title: "Error",
        description: "Failed to remove floorplan",
        variant: "destructive"
      });
    }
  };

  // Fetch floorplans for a property
  const fetchFloorplans = async (propertyId: string) => {
    try {
      // First try to get structured floorplans from properties table
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('floorplans')
        .eq('id', propertyId)
        .single();
        
      if (!propertyError && propertyData?.floorplans) {
        return Array.isArray(propertyData.floorplans) ? propertyData.floorplans : [];
      }
      
      // Fallback: Get floorplans from property_images
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan');
        
      if (!imagesError && imagesData) {
        return imagesData.map(img => ({
          id: img.id,
          url: img.url
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching floorplans:", error);
      return [];
    }
  };

  return {
    handleFloorplanUpload,
    handleTechnicalItemFloorplanUpload,
    handleRemoveFloorplan,
    fetchFloorplans,
    isUploading
  };
}
