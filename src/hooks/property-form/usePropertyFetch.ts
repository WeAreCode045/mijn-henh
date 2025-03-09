
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initialFormData } from "./initialFormData";
import type { PropertyFormData, PropertyAgent, PropertyImage } from "@/types/property";
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
        
        const featuredImages = allImages
          ? allImages.filter(img => img.is_featured_image).map(img => img.url)
          : [];
          
        const featuredImage = allImages
          ? allImages.find(img => img.is_main)?.url || null
          : null;
        
        // Create a proper agent object if agent_id exists
        let agentData: PropertyAgent | undefined;
        if (data.agent_id) {
          const { data: agentProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.agent_id)
            .single();
            
          if (agentProfile) {
            agentData = {
              id: agentProfile.id,
              name: agentProfile.full_name || '',
              email: agentProfile.email || '',
              phone: agentProfile.phone || '',
              photoUrl: agentProfile.agent_photo || '',
              address: ''
            };
          }
        }
        
        setFormData({
          ...initialFormData,
          ...data,
          id: propertyId,
          features: transformedFeatures,
          areas: transformedAreas,
          nearby_places: transformedNearbyPlaces,
          featuredImages: featuredImages,
          coverImages: featuredImages, // Keep for backward compatibility
          featuredImage: featuredImage,
          agent: agentData,
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
