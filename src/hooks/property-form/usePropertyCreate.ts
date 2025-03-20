
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData } from "@/types/property";
import { prepareAreasForFormSubmission } from "./preparePropertyData";
import { preparePropertyDataForSubmission } from "./utils/propertyDataFormatter";

export function usePropertyCreate() {
  const { toast } = useToast();
  
  const createProperty = async (data: PropertySubmitData): Promise<boolean> => {
    console.log("usePropertyCreate - Creating new property with data:", JSON.stringify(data));
    
    try {
      // Transform areas to the correct format for the database
      if (data.areas && Array.isArray(data.areas)) {
        const transformedAreas = prepareAreasForFormSubmission(data.areas as any);
        data.areas = transformedAreas as any;
      }

      // Prepare data for submission
      const finalDataToCreate = preparePropertyDataForSubmission(data);

      console.log("usePropertyCreate - Final create data:", finalDataToCreate);
      
      const { error, data: createdData } = await supabase
        .from('properties')
        .insert(finalDataToCreate)
        .select();
        
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      console.log("Property created successfully:", createdData);
      console.log("Initial timestamps - created_at:", createdData?.[0]?.created_at, "updated_at:", createdData?.[0]?.updated_at);
      
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      
      return true;
    } catch (error) {
      console.error('usePropertyCreate - Error creating property:', error);
      toast({
        title: "Error",
        description: "There was a problem creating the property",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return { createProperty };
}
