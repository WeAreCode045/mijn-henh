
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData } from "@/types/property";
import { prepareAreasForFormSubmission } from "./preparePropertyData";
import { preparePropertyDataForSubmission } from "./utils/propertyDataFormatter";

export function usePropertyUpdate() {
  const { toast } = useToast();
  
  const updateProperty = async (id: string, data: PropertySubmitData): Promise<boolean> => {
    console.log("usePropertyUpdate - Updating property with ID:", id);
    console.log("usePropertyUpdate - Update data:", JSON.stringify(data));
    
    try {
      // Transform areas to the correct format for the database
      if (data.areas && Array.isArray(data.areas)) {
        const transformedAreas = prepareAreasForFormSubmission(data.areas as any);
        data.areas = transformedAreas as any;
      }

      // Prepare data for submission
      const finalDataToUpdate = preparePropertyDataForSubmission(data);
      
      // Log key values for debugging
      console.log("usePropertyUpdate - floorplanEmbedScript value:", finalDataToUpdate.floorplanEmbedScript);
      console.log("usePropertyUpdate - shortDescription value:", finalDataToUpdate.shortDescription);
      console.log("usePropertyUpdate - metadata value:", finalDataToUpdate.metadata);
      
      console.log("usePropertyUpdate - Final update data:", finalDataToUpdate);
            
      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(finalDataToUpdate)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      console.log("Property updated successfully:", updatedData);
      console.log("New updated_at timestamp:", updatedData?.[0]?.updated_at);
      
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('usePropertyUpdate - Error updating property:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the property",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return { updateProperty };
}
