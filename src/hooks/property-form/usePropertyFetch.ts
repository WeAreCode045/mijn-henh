
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initialFormData } from "./initialFormData";
import type { PropertyFormData } from "@/types/property";
import { transformFeatures, transformAreas, transformFloorplans, transformNearbyPlaces } from "./propertyDataTransformer";

export function usePropertyFetch(id: string | undefined) {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyData(id);
    }
  }, [id]);

  const fetchPropertyData = async (propertyId: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log("Fetched property data:", data);
        
        // Transform the properties as needed
        const transformedFeatures = transformFeatures(Array.isArray(data.features) ? data.features : []);
        const transformedAreas = transformAreas(Array.isArray(data.areas) ? data.areas : []);
        const transformedFloorplans = transformFloorplans(data.floorplans || []);
        const transformedNearbyPlaces = transformNearbyPlaces(Array.isArray(data.nearby_places) ? data.nearby_places : []);
        
        // Update form data with fetched property data
        setFormData({
          ...initialFormData,
          ...data,
          id: propertyId,
          features: transformedFeatures,
          areas: transformedAreas,
          floorplans: transformedFloorplans,
          nearby_places: transformedNearbyPlaces,
          // Convert null values to empty strings or arrays as needed
          images: data.images?.map((url: string) => ({ id: crypto.randomUUID(), url })) || [],
          gridImages: data.gridImages || [],
          // Ensure the floorplanEmbedScript is set
          floorplanEmbedScript: data.floorplanEmbedScript || ""
        });
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, setFormData, isLoading };
}
