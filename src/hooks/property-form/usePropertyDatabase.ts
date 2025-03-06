
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData } from "@/types/property";
import { prepareAreasForFormSubmission, preparePropertiesForJsonField } from "./preparePropertyData";

export function usePropertyDatabase() {
  const { toast } = useToast();
  
  const updateProperty = async (id: string, data: PropertySubmitData): Promise<boolean> => {
    console.log("usePropertyDatabase - Updating property with ID:", id);
    console.log("usePropertyDatabase - Update data:", JSON.stringify(data));
    
    try {
      // Transform areas to the correct format for the database
      if (data.areas && Array.isArray(data.areas)) {
        // Cast to any to avoid TypeScript errors while still using the function properly
        const transformedAreas = prepareAreasForFormSubmission(data.areas as any);
        data.areas = transformedAreas;
      }

      // Transform features to the correct format
      if (data.features && Array.isArray(data.features)) {
        data.features = preparePropertiesForJsonField(data.features);
      }

      // Transform nearby_places to the correct format
      if (data.nearby_places && Array.isArray(data.nearby_places)) {
        data.nearby_places = preparePropertiesForJsonField(data.nearby_places);
      }
      
      // Transform technicalItems to the correct format
      if (data.technicalItems) {
        data.technicalItems = preparePropertiesForJsonField(data.technicalItems);
      }

      // Make a copy of data without fields that don't exist in the database
      const { featuredImage, featuredImages, coverImages, floorplans, ...dataToUpdate } = data as any;
      
      console.log("usePropertyDatabase - Final update data:", dataToUpdate);
      
      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(dataToUpdate)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      console.log("Property updated successfully:", updatedData);
      
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('usePropertyDatabase - Error updating property:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the property",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const createProperty = async (data: PropertySubmitData): Promise<boolean> => {
    console.log("usePropertyDatabase - Creating new property with data:", JSON.stringify(data));
    
    try {
      // Transform areas to the correct format for the database
      if (data.areas && Array.isArray(data.areas)) {
        // Cast to any to avoid TypeScript errors while still using the function properly
        const transformedAreas = prepareAreasForFormSubmission(data.areas as any);
        data.areas = transformedAreas;
      }

      // Transform features to the correct format
      if (data.features && Array.isArray(data.features)) {
        data.features = preparePropertiesForJsonField(data.features);
      }

      // Transform nearby_places to the correct format
      if (data.nearby_places && Array.isArray(data.nearby_places)) {
        data.nearby_places = preparePropertiesForJsonField(data.nearby_places);
      }
      
      // Transform technicalItems to the correct format
      if (data.technicalItems) {
        data.technicalItems = preparePropertiesForJsonField(data.technicalItems);
      }

      // Make a copy of data without fields that don't exist in the database
      const { featuredImage, featuredImages, coverImages, floorplans, ...dataToCreate } = data as any;

      console.log("usePropertyDatabase - Final create data:", dataToCreate);
      
      const { error, data: createdData } = await supabase
        .from('properties')
        .insert(dataToCreate)
        .select();
        
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      console.log("Property created successfully:", createdData);
      
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      
      return true;
    } catch (error) {
      console.error('usePropertyDatabase - Error creating property:', error);
      toast({
        title: "Error",
        description: "There was a problem creating the property",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return { updateProperty, createProperty };
}
