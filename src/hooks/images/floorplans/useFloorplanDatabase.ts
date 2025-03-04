
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFloorplan } from "@/types/property";

export function useFloorplanDatabase() {
  const { toast } = useToast();

  // Save floorplans to property_images table
  const saveFloorplans = async (
    propertyId: string,
    floorplans: PropertyFloorplan[]
  ): Promise<boolean> => {
    try {
      // First, get existing floorplans
      const { data: existingFloorplans, error: fetchError } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan');

      if (fetchError) {
        console.error("Error fetching existing floorplans:", fetchError);
        return false;
      }

      // Identify existing floorplans that are no longer present
      const newFloorplanUrls = floorplans.map(f => f.url);
      const floorplansToDelete = existingFloorplans.filter(
        f => !newFloorplanUrls.includes(f.url)
      );

      // Delete removed floorplans
      if (floorplansToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('property_images')
          .delete()
          .in('id', floorplansToDelete.map(f => f.id));

        if (deleteError) {
          console.error("Error deleting floorplans:", deleteError);
        }
      }

      // Add or update floorplans
      for (const floorplan of floorplans) {
        const existingFloorplan = existingFloorplans.find(f => f.url === floorplan.url);

        if (!existingFloorplan) {
          // Insert new floorplan
          const { error: insertError } = await supabase
            .from('property_images')
            .insert({
              property_id: propertyId,
              url: floorplan.url,
              type: 'floorplan'
            });

          if (insertError) {
            console.error("Error inserting floorplan:", insertError);
          }
        }
      }

      toast({
        title: "Success",
        description: "Floorplans saved successfully",
      });
      
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

  return { saveFloorplans };
}
