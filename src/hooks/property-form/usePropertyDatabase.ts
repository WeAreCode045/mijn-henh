
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
    console.log("usePropertyDatabase - Features data:", JSON.stringify(data.features));
    
    try {
      // Remove floorplans from the data as we store them in property_images now
      const { floorplans, featuredImage, coverImages, ...updateData } = data;

      // Transform areas to the correct format for the database
      if (updateData.areas && Array.isArray(updateData.areas)) {
        // Use the updated prepareAreasForFormSubmission function
        const transformedAreas = prepareAreasForFormSubmission(updateData.areas);
        updateData.areas = transformedAreas;
      }

      // Transform features to the correct format
      if (updateData.features && Array.isArray(updateData.features)) {
        updateData.features = preparePropertiesForJsonField(updateData.features);
      }

      // Transform nearby_places to the correct format
      if (updateData.nearby_places && Array.isArray(updateData.nearby_places)) {
        updateData.nearby_places = preparePropertiesForJsonField(updateData.nearby_places);
      }

      console.log("usePropertyDatabase - Final update data:", updateData);
      
      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(updateData as any)
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
    console.log("usePropertyDatabase - Features data:", JSON.stringify(data.features));
    
    try {
      // Remove floorplans from the data as we store them in property_images now
      const { floorplans, featuredImage, coverImages, ...createData } = data;

      // Transform areas to the correct format for the database
      if (createData.areas && Array.isArray(createData.areas)) {
        // Use the updated prepareAreasForFormSubmission function
        const transformedAreas = prepareAreasForFormSubmission(createData.areas);
        createData.areas = transformedAreas;
      }

      // Transform features to the correct format
      if (createData.features && Array.isArray(createData.features)) {
        createData.features = preparePropertiesForJsonField(createData.features);
      }

      // Transform nearby_places to the correct format
      if (createData.nearby_places && Array.isArray(createData.nearby_places)) {
        createData.nearby_places = preparePropertiesForJsonField(createData.nearby_places);
      }

      console.log("usePropertyDatabase - Final create data:", createData);
      
      const { error, data: createdData } = await supabase
        .from('properties')
        .insert(createData as any)
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
