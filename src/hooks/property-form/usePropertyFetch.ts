
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initialFormData } from "./initialFormData";
import type { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { transformFeatures, transformAreas, transformNearbyPlaces } from "./propertyDataTransformer";

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
      // Fetch base property data
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Fetch all images
        const { data: allImages, error: imagesError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId);
          
        if (imagesError) {
          console.error("Error fetching property images:", imagesError);
        }
        
        // Transform data for the form
        const transformedFeatures = transformFeatures(Array.isArray(data.features) ? data.features : []);
        const transformedAreas = transformAreas(Array.isArray(data.areas) ? data.areas : []);
        const transformedNearbyPlaces = transformNearbyPlaces(Array.isArray(data.nearby_places) ? data.nearby_places : []);
        
        // Transform technicalItems if present
        const transformedTechnicalItems: PropertyTechnicalItem[] = data.technicalItems 
          ? (Array.isArray(data.technicalItems) 
              ? data.technicalItems.map((item: any) => ({
                  id: item.id || '',
                  title: item.title || '',
                  size: item.size || '',
                  description: item.description || '',
                  floorplanId: item.floorplanId || null,
                  columns: item.columns || undefined
                }))
              : []) 
          : [];
        
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
          nearby_places: transformedNearbyPlaces,
          technicalItems: transformedTechnicalItems,
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
            : []
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
