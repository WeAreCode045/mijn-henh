
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData, PropertyImage, PropertyAgent } from "@/types/property";
import { initialFormData } from "./initialFormData";

// Helper function to safely convert JSON or array to array
const safeParseArray = (value: any, defaultValue: any[] = []): any[] => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  return defaultValue;
};

// Helper function to safely convert agent data to PropertyAgent type
const formatAgentData = (agentData: any): PropertyAgent | undefined => {
  if (!agentData) return undefined;
  
  if (typeof agentData === 'string') {
    return {
      id: agentData,
      name: 'Unknown Agent',
    };
  }
  
  if (typeof agentData === 'object') {
    return {
      id: agentData.id || '',
      name: agentData.name || agentData.full_name || 'Unknown Agent',
      email: agentData.email,
      phone: agentData.phone,
      photoUrl: agentData.photoUrl || agentData.photo_url,
      address: agentData.address,
    };
  }
  
  return undefined;
};

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
        
        // Fetch images from property_images table
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', id)
          .order('sort_order', { ascending: true });
          
        if (imageError) {
          console.error('Error fetching property images:', imageError);
        }
        
        const images: PropertyImage[] = imageData || [];
        
        // Filter images by type and flags
        const regularImages = images.filter(img => img.type === 'image' || !img.type);
        const floorplanImages = images.filter(img => img.type === 'floorplan');
        const featuredImage = regularImages.find(img => img.is_main)?.url || null;
        const featuredImages = regularImages
          .filter(img => img.is_featured_image)
          .map(img => img.url);
        
        if (propertyData) {
          // Parse JSON strings from the database to objects
          const features = safeParseArray(propertyData.features);
          const areas = safeParseArray(propertyData.areas);
          const nearby_places = safeParseArray(propertyData.nearby_places);
          
          // Process agent data
          const agentData = formatAgentData(propertyData.agent || propertyData.agent_id);
          
          // Set the form data with safe defaults for new fields
          setFormData({
            ...initialFormData,
            ...propertyData,
            features,
            areas,
            nearby_places,
            hasGarden: propertyData.hasGarden || false,
            images: regularImages,
            floorplans: floorplanImages,
            featuredImage: featuredImage,
            featuredImages: featuredImages,
            agent: agentData,
            // Legacy fields for backward compatibility
            coverImages: featuredImages,
            gridImages: featuredImages
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
