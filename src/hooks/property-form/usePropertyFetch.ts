
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
      console.log("usePropertyFetch - Fetching property with ID:", id);
      fetchPropertyData(id);
    }
  }, [id]);

  const fetchPropertyData = async (propertyId: string) => {
    setIsLoading(true);
    
    try {
      // Get the property data
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('id', propertyId)
        .single();
        
      if (error) {
        console.error("Error fetching property data:", error);
        throw error;
      }
      
      if (data) {
        console.log("Fetched property data:", data);
        
        // Ensure all arrays are properly initialized
        const transformedFeatures = transformFeatures(Array.isArray(data.features) ? data.features : []);
        const transformedAreas = transformAreas(Array.isArray(data.areas) ? data.areas : []);
        const transformedFloorplans = transformFloorplans(Array.isArray(data.floorplans) ? data.floorplans : []);
        const transformedNearbyPlaces = transformNearbyPlaces(Array.isArray(data.nearby_places) ? data.nearby_places : []);
        
        // Get property images from the join table
        const propertyImages = Array.isArray(data.property_images) 
          ? data.property_images.map((img: any) => ({ 
              id: img.id, 
              url: img.url,
              type: img.type || 'image'
            }))
          : [];
        
        console.log("Transformed property data:", {
          features: transformedFeatures,
          areas: transformedAreas,
          floorplans: transformedFloorplans,
          nearby_places: transformedNearbyPlaces,
          images: propertyImages
        });
        
        // Update form data with fetched property data
        setFormData({
          ...initialFormData,
          ...data,
          id: propertyId,
          features: transformedFeatures,
          areas: transformedAreas,
          floorplans: transformedFloorplans,
          nearby_places: transformedNearbyPlaces,
          // Convert images to expected format
          images: propertyImages.filter((img: any) => img.type === 'image' || !img.type),
          // Ensure other arrays are initialized properly
          gridImages: data.gridImages || [],
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
