
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useFloorplanUpload(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    
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
          id: crypto.randomUUID(),
          url: publicUrl,
          filePath,
          columns: 1 // Default to 1 column
        };
      });

      const newFloorplans = await Promise.all(uploadPromises);
      
      // Ensure floorplans is always an array
      const currentFloorplans = Array.isArray(formData.floorplans) ? [...formData.floorplans] : [];
      
      setFormData({
        ...formData,
        floorplans: [...currentFloorplans, ...newFloorplans]
      });

      // Add to property_images table if property already exists
      if (formData.id) {
        for (const floorplan of newFloorplans) {
          await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              url: floorplan.url,
              type: 'floorplan'
            });
        }
      }

      toast({
        title: "Success",
        description: "Floorplans uploaded successfully"
      });
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

  const handleRemoveFloorplan = async (index: number) => {
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      return;
    }
    
    const floorplanToRemove = formData.floorplans[index];
    
    try {
      // Delete from storage if filePath exists
      if (floorplanToRemove.filePath) {
        await supabase.storage
          .from('properties')
          .remove([floorplanToRemove.filePath]);
      }
      
      // Update form data
      const updatedFloorplans = [...formData.floorplans];
      updatedFloorplans.splice(index, 1);
      
      setFormData({
        ...formData,
        floorplans: updatedFloorplans
      });
      
      // Remove from property_images if property exists
      if (formData.id && floorplanToRemove.url) {
        await supabase
          .from('property_images')
          .delete()
          .eq('url', floorplanToRemove.url)
          .eq('property_id', formData.id);
      }
      
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

  const handleTechnicalItemFloorplanUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    technicalItemId: string
  ) => {
    if (!e.target.files?.length || !technicalItemId) return;
    
    setIsUploading(true);
    
    try {
      const file = e.target.files[0];
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

      // Create a new floorplan
      const newFloorplan = {
        id: crypto.randomUUID(),
        url: publicUrl,
        filePath,
        columns: 1
      };
      
      // Add to floorplans array
      const currentFloorplans = Array.isArray(formData.floorplans) ? [...formData.floorplans] : [];
      const updatedFloorplans = [...currentFloorplans, newFloorplan];
      
      // Update technical item to reference this floorplan
      const updatedTechnicalItems = (formData.technicalItems || []).map(item => {
        if (item.id === technicalItemId) {
          return {
            ...item,
            floorplanId: newFloorplan.id
          };
        }
        return item;
      });
      
      setFormData({
        ...formData,
        floorplans: updatedFloorplans,
        technicalItems: updatedTechnicalItems
      });
      
      // Add to property_images if property exists
      if (formData.id) {
        await supabase
          .from('property_images')
          .insert({
            property_id: formData.id,
            url: publicUrl,
            type: 'floorplan'
          });
      }

      toast({
        title: "Success",
        description: "Floorplan uploaded and linked to technical item"
      });
    } catch (error) {
      console.error("Error uploading technical item floorplan:", error);
      toast({
        title: "Error",
        description: "Failed to upload floorplan for technical item",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const fetchFloorplans = async (propertyId: string) => {
    try {
      // First get any floorplans from property_images table with type 'floorplan'
      const { data: floorplanImages, error: floorplanImagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan');
        
      if (floorplanImagesError) throw floorplanImagesError;

      // Convert to PropertyFloorplan format
      const floorplans = floorplanImages.map(img => ({
        id: img.id,
        url: img.url,
        columns: 1
      }));
      
      // Also get any floorplans stored directly in the properties table
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('floorplans')
        .eq('id', propertyId)
        .single();
        
      if (propertyError) throw propertyError;
      
      let combinedFloorplans = [...floorplans];
      
      // Process property.floorplans if it exists
      if (propertyData?.floorplans && Array.isArray(propertyData.floorplans)) {
        // Convert string URLs to PropertyFloorplan objects
        const propertyFloorplans = propertyData.floorplans.map(fp => {
          if (typeof fp === 'string') {
            return {
              id: crypto.randomUUID(),
              url: fp,
              columns: 1
            };
          }
          return fp;
        });
        
        // Combine with floorplans from property_images, avoiding duplicates
        const existingUrls = new Set(floorplans.map(f => f.url));
        const uniquePropertyFloorplans = propertyFloorplans.filter(fp => !existingUrls.has(fp.url));
        
        combinedFloorplans = [...floorplans, ...uniquePropertyFloorplans];
      }
      
      return combinedFloorplans;
    } catch (error) {
      console.error("Error fetching floorplans:", error);
      toast({
        title: "Error",
        description: "Failed to fetch floorplans",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleTechnicalItemFloorplanUpload,
    fetchFloorplans,
    isUploading
  };
}
