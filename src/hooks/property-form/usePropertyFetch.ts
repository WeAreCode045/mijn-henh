
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";
import { initialFormData } from "./initialFormData";

export function usePropertyFetch(id: string | undefined) {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch the property from the database
        const { data: propertyData, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (propertyData) {
          // Parse JSON strings from the database to objects
          const features = propertyData.features ? 
            (typeof propertyData.features === 'string' ? 
              JSON.parse(propertyData.features) : propertyData.features) : [];
          
          const areas = propertyData.areas ? 
            (typeof propertyData.areas === 'string' ? 
              JSON.parse(propertyData.areas) : propertyData.areas) : [];
          
          const nearby_places = propertyData.nearby_places ? 
            (typeof propertyData.nearby_places === 'string' ? 
              JSON.parse(propertyData.nearby_places) : propertyData.nearby_places) : [];

          // Handle nearby_cities safely with optional chaining and default to empty array
          const nearby_cities = propertyData.nearby_cities ? 
            (typeof propertyData.nearby_cities === 'string' ? 
              JSON.parse(propertyData.nearby_cities) : propertyData.nearby_cities) : [];

          // Get images as array safely
          const images = Array.isArray(propertyData.images) ? 
            propertyData.images : 
            (propertyData.images ? [propertyData.images] : []);
          
          // Handle floorplans safely with optional chaining and default to empty array
          const floorplans = propertyData.floorplans ? 
            (Array.isArray(propertyData.floorplans) ? 
              propertyData.floorplans : 
              (propertyData.floorplans ? [propertyData.floorplans] : [])) : [];
          
          // Set the form data with safe defaults for new fields
          setFormData({
            ...initialFormData,
            ...propertyData,
            features,
            areas,
            nearby_places,
            nearby_cities: nearby_cities || [],
            hasGarden: propertyData.hasGarden || false,
            images: images || [],
            floorplans: floorplans || [],
            featuredImages: propertyData.featuredImages || [],
            coverImages: propertyData.coverImages || [],
            gridImages: propertyData.gridImages || [],
            areaPhotos: propertyData.areaPhotos || []
          });
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProperty();
  }, [id]);
  
  return { formData, setFormData, isLoading };
}
