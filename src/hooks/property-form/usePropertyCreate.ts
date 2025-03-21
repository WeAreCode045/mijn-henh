
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData } from "@/types/property";
import { prepareAreasForFormSubmission } from "./preparePropertyData";
import { preparePropertyDataForSubmission } from "./utils/propertyDataFormatter";
import { v4 as uuidv4 } from "uuid";

export function usePropertyCreate() {
  const { toast } = useToast();
  
  const createProperty = async (data: PropertySubmitData): Promise<boolean> => {
    console.log("usePropertyCreate - Creating new property with data:", JSON.stringify(data));
    
    try {
      // Generate object_id if not provided
      if (!data.object_id) {
        // Generate a shorter unique ID for object_id
        data.object_id = `P-${uuidv4().substring(0, 8)}`;
        console.log("Generated object_id:", data.object_id);
      }
      
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
