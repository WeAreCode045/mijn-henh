
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Floorplan } from "@/components/property/form/steps/technical-data/FloorplanUpload";

export function useFloorplans(
  propertyId: string | undefined,
  initialFloorplans: Floorplan[] = []
) {
  const { toast } = useToast();
  const [floorplans, setFloorplans] = useState<Floorplan[]>(initialFloorplans);
  const [isUploading, setIsUploading] = useState(false);

  // Handle floorplan image upload
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !propertyId) return;
    
    setIsUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        // Create a unique file name with UUID to prevent collisions
        const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^\x00-\x7F]/g, '')}`;
        
        // Define the file path in the storage bucket
        const filePath = `properties/${propertyId}/floorplans/${fileName}`;
        
        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        // Return a new Floorplan object
        return {
          id: crypto.randomUUID(),
          url: publicUrl,
          title: `Floorplan ${floorplans.length + 1}`
        };
      });
      
      // Wait for all uploads to complete
      const newFloorplans = await Promise.all(uploadPromises);
      
      // Update floorplans state
      setFloorplans(prevFloorplans => [...prevFloorplans, ...newFloorplans]);
      
      // Add floorplan data to database
      if (propertyId) {
        await Promise.all(newFloorplans.map(async (floorplan) => {
          await supabase
            .from('property_images')
            .insert({
              property_id: propertyId,
              url: floorplan.url,
              type: 'floorplan',
              title: floorplan.title
            });
        }));
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
      const floorplanToRemove = floorplans[index];
      if (!floorplanToRemove) return;
      
      // Update state
      setFloorplans(prevFloorplans => prevFloorplans.filter((_, i) => i !== index));
      
      // Delete from database if property ID exists
      if (propertyId) {
        await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyId)
          .eq('url', floorplanToRemove.url)
          .eq('type', 'floorplan');
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
    setFloorplans(prevFloorplans => {
      const updatedFloorplans = [...prevFloorplans];
      updatedFloorplans[index] = {
        ...updatedFloorplans[index],
        [field]: value
      };
      return updatedFloorplans;
    });
    
    // Update database if property ID exists
    if (propertyId && field === 'title') {
      const floorplan = floorplans[index];
      supabase
        .from('property_images')
        .update({ title: value })
        .eq('property_id', propertyId)
        .eq('url', floorplan.url)
        .eq('type', 'floorplan');
    }
  };

  return {
    floorplans,
    isUploading,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan
  };
}
