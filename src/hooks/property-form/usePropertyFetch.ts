
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
      // Fetch the main property data
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
        
        // Fetch floorplans from property_images table
        const { data: floorplanData, error: floorplanError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .eq('type', 'floorplan');
          
        if (floorplanError) {
          console.error("Error fetching floorplans:", floorplanError);
        }
        
        // Transform floorplans
        const transformedFloorplans = floorplanData 
          ? transformFloorplans(floorplanData.map(item => ({
              id: item.id,
              url: item.url,
              filePath: item.url,
              columns: 2 // Default column value
            })))
          : [];
        
        // Transform other properties
        const transformedFeatures = transformFeatures(Array.isArray(data.features) ? data.features : []);
        const transformedAreas = transformAreas(Array.isArray(data.areas) ? data.areas : []);
        const transformedNearbyPlaces = transformNearbyPlaces(Array.isArray(data.nearby_places) ? data.nearby_places : []);
        
        // Fetch all property images to get grid images
        const { data: allImages, error: imagesError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId);
          
        if (imagesError) {
          console.error("Error fetching property images:", imagesError);
        }
        
        // Extract grid images
        const gridImages = allImages
          ? allImages.filter(img => img.is_grid_image).map(img => img.url)
          : [];
          
        // Extract featured image
        const featuredImage = allImages
          ? allImages.find(img => img.is_featured)?.url || null
          : null;
        
        // Update form data with fetched property data
        setFormData({
          ...initialFormData,
          ...data,
          id: propertyId,
          features: transformedFeatures,
          areas: transformedAreas,
          floorplans: transformedFloorplans,
          nearby_places: transformedNearbyPlaces,
          // Set grid images and featured image from property_images table
          gridImages: gridImages,
          featuredImage: featuredImage,
          // Convert null values to empty strings or arrays as needed
          images: allImages
            ? allImages.filter(img => img.type !== 'floorplan').map(img => ({ 
                id: img.id, 
                url: img.url,
                area: img.area,
                is_featured: img.is_featured,
                is_grid_image: img.is_grid_image
              })) 
            : [],
          // Ensure the floorplanEmbedScript is set correctly
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
