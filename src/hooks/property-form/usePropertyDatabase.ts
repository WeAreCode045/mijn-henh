
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
        data.areas = transformedAreas as any;
      }

      // Convert features JSON to string format if it's not already a string
      const featuresJson = typeof data.features === 'string' 
        ? data.features 
        : JSON.stringify(data.features);

      // Convert nearby_places JSON to string format if it's not already a string
      const nearby_placesJson = typeof data.nearby_places === 'string'
        ? data.nearby_places
        : JSON.stringify(data.nearby_places);

      // Convert nearby_cities JSON to string format if it's not already a string
      const nearby_citiesJson = typeof data.nearby_cities === 'string'
        ? data.nearby_cities
        : JSON.stringify(data.nearby_cities);
      
      // Create or update metadata if status exists
      const metadata = data.metadata || {};
      if (data.status) {
        metadata.status = data.status;
      }
      
      // Make a copy of data without fields that don't exist in the database
      const { 
        featuredImage, 
        featuredImages, 
        coverImages, 
        floorplans, 
        images, // Remove the images field that doesn't exist in properties table
        ...dataToUpdate 
      } = data as any;
      
      // Update with properly stringified JSON values
      const finalDataToUpdate = {
        ...dataToUpdate,
        features: featuresJson,
        nearby_places: nearby_placesJson,
        nearby_cities: nearby_citiesJson,
        metadata: metadata
      };
      
      // Ensure floorplanEmbedScript is included in the data to update
      console.log("usePropertyDatabase - floorplanEmbedScript value:", finalDataToUpdate.floorplanEmbedScript);
      console.log("usePropertyDatabase - shortDescription value:", finalDataToUpdate.shortDescription);
      console.log("usePropertyDatabase - metadata value:", finalDataToUpdate.metadata);
      
      console.log("usePropertyDatabase - Final update data:", finalDataToUpdate);
      
      // Remove updated_at to let Supabase automatically set it to current time
      if (finalDataToUpdate.updated_at) {
        delete finalDataToUpdate.updated_at;
      }
      
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
        data.areas = transformedAreas as any;
      }

      // Convert features JSON to string format if it's not already a string
      const featuresJson = typeof data.features === 'string' 
        ? data.features 
        : JSON.stringify(data.features);

      // Convert nearby_places JSON to string format if it's not already a string
      const nearby_placesJson = typeof data.nearby_places === 'string'
        ? data.nearby_places
        : JSON.stringify(data.nearby_places);

      // Convert nearby_cities JSON to string format if it's not already a string
      const nearby_citiesJson = typeof data.nearby_cities === 'string'
        ? data.nearby_cities
        : JSON.stringify(data.nearby_cities);

      // Create metadata if status exists
      const metadata = data.metadata || {};
      if (data.status) {
        metadata.status = data.status;
      }

      // Ensure floorplanEmbedScript is included in the data
      console.log("usePropertyDatabase - floorplanEmbedScript value for new property:", data.floorplanEmbedScript);
      console.log("usePropertyDatabase - shortDescription value for new property:", data.shortDescription);
      console.log("usePropertyDatabase - metadata value for new property:", metadata);

      // Make a copy of data without fields that don't exist in the database
      const { 
        featuredImage, 
        featuredImages, 
        coverImages, 
        floorplans, 
        images, // Remove the images field that doesn't exist in properties table
        ...dataToCreate 
      } = data as any;

      // Update with properly stringified JSON values
      const finalDataToCreate = {
        ...dataToCreate,
        features: featuresJson,
        nearby_places: nearby_placesJson,
        nearby_cities: nearby_citiesJson,
        metadata: metadata
      };

      // Remove created_at and updated_at to let Supabase handle them automatically
      if (finalDataToCreate.created_at) {
        delete finalDataToCreate.created_at;
      }
      if (finalDataToCreate.updated_at) {
        delete finalDataToCreate.updated_at;
      }

      console.log("usePropertyDatabase - Final create data:", finalDataToCreate);
      
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
