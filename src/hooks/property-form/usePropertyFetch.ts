
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
        
        const { data: floorplanData, error: floorplanError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .eq('type', 'floorplan');
          
        if (floorplanError) {
          console.error("Error fetching floorplans:", floorplanError);
        }
        
        const transformedFloorplans = floorplanData 
          ? transformFloorplans(floorplanData.map(item => ({
              id: item.id,
              url: item.url,
              filePath: item.url,
              columns: 2 // Default column value
            })))
          : [];
        
        const transformedFeatures = transformFeatures(Array.isArray(data.features) ? data.features : []);
        const transformedAreas = transformAreas(Array.isArray(data.areas) ? data.areas : []);
        const transformedNearbyPlaces = transformNearbyPlaces(Array.isArray(data.nearby_places) ? data.nearby_places : []);
        
        const { data: allImages, error: imagesError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId);
          
        if (imagesError) {
          console.error("Error fetching property images:", imagesError);
        }
        
        const featuredImages = allImages
          ? allImages.filter(img => img.is_featured_image).map(img => img.url)
          : [];
          
        const featuredImage = allImages
          ? allImages.find(img => img.is_main)?.url || null
          : null;
        
        setFormData({
          ...initialFormData,
          ...data,
          id: propertyId,
          features: transformedFeatures,
          areas: transformedAreas,
          floorplans: transformedFloorplans,
          nearby_places: transformedNearbyPlaces,
          featuredImages: featuredImages,
          coverImages: featuredImages, // Keep for backward compatibility
          featuredImage: featuredImage,
          images: allImages
            ? allImages.filter(img => img.type !== 'floorplan').map(img => ({ 
                id: img.id, 
                url: img.url,
                area: img.area,
                is_main: img.is_main,
                is_featured_image: img.is_featured_image
              })) 
            : [],
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
