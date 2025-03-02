
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFloorplan } from "@/types/property";

export function useFloorplanDatabase() {
  const { toast } = useToast();

  const addFloorplanToDatabase = async (propertyId: string, floorplan: PropertyFloorplan) => {
    try {
      const { error } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: floorplan.url,
          type: 'floorplan' // Add type to distinguish floorplans
        });
        
      if (error) {
        console.error('Error adding floorplan to property_images table:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception adding floorplan to database:', error);
      return false;
    }
  };

  const removeFloorplanFromDatabase = async (propertyId: string, floorplanUrl: string) => {
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('url', floorplanUrl)
        .eq('property_id', propertyId);
        
      if (error) {
        console.error('Error removing floorplan from property_images table:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception removing floorplan from database:', error);
      return false;
    }
  };

  const updatePropertyFloorplans = async (propertyId: string, floorplansForDb: any) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ floorplans: floorplansForDb })
        .eq('id', propertyId);
        
      if (error) {
        console.error('Error updating floorplans in database:', error);
        toast({
          title: "Error", 
          description: "Failed to update database with floorplan changes",
          variant: "destructive"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception updating floorplans in database:', error);
      return false;
    }
  };

  return {
    addFloorplanToDatabase,
    removeFloorplanFromDatabase,
    updatePropertyFloorplans
  };
}
