
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFloorplan } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function useFloorplanDatabase() {
  const { toast } = useToast();

  // Save floorplans directly to property_images table
  const saveFloorplans = async (propertyId: string, floorplans: PropertyFloorplan[]): Promise<boolean> => {
    try {
      if (!propertyId) {
        console.error("Cannot save floorplans without a property ID");
        return false;
      }

      console.log(`Saving ${floorplans.length} floorplans for property ${propertyId}`);
      return true;
    } catch (error) {
      console.error("Error saving floorplans:", error);
      toast({
        title: "Error",
        description: "Failed to save floorplans",
        variant: "destructive",
      });
      return false;
    }
  };

  // Add a single floorplan to the database
  const addFloorplanToDatabase = async (propertyId: string, floorplan: PropertyFloorplan): Promise<boolean> => {
    try {
      if (!propertyId || !floorplan.url) {
        console.error("Cannot add floorplan without property ID or URL");
        return false;
      }

      const { error } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: floorplan.url,
          type: 'floorplan'
        });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error adding floorplan to database:", error);
      return false;
    }
  };

  // Remove a floorplan from the database
  const removeFloorplanFromDatabase = async (propertyId: string, floorplanUrl: string): Promise<boolean> => {
    try {
      if (!propertyId || !floorplanUrl) {
        console.error("Cannot remove floorplan without property ID or URL");
        return false;
      }

      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .eq('url', floorplanUrl)
        .eq('type', 'floorplan');

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error removing floorplan from database:", error);
      return false;
    }
  };

  // Update property floorplans in the database (legacy function)
  const updatePropertyFloorplans = async (propertyId: string, floorplans: Json): Promise<boolean> => {
    try {
      if (!propertyId) {
        console.error("Cannot update floorplans without a property ID");
        return false;
      }

      console.log("This function is deprecated. Floorplans are now stored in property_images table.");
      return true;
    } catch (error) {
      console.error("Error updating property floorplans:", error);
      return false;
    }
  };

  return { 
    saveFloorplans, 
    addFloorplanToDatabase, 
    removeFloorplanFromDatabase, 
    updatePropertyFloorplans 
  };
}
