
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData, PropertyImage, PropertyAgent, PropertyCity } from "@/types/property";
import { initialFormData } from "./initialFormData";
import { Json } from "@/integrations/supabase/types";

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
      photoUrl: agentData.avatar_url, // Using avatar_url instead of agent_photo
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
      if (!id) {
        console.log("usePropertyFetch - No ID provided, using initial form data");
        return;
      }
      
      setIsLoading(true);
      console.log("usePropertyFetch - Fetching property with ID:", id);
      
      try {
        // Fetch the property from the database
        const { data: propertyData, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("usePropertyFetch - Error fetching property:", error);
          throw error;
        }
        
        console.log("usePropertyFetch - Property data fetched:", propertyData ? {
          id: propertyData.id,
          title: propertyData.title,
          features: Array.isArray(propertyData.features) ? 
            propertyData.features.length + " features" : 
            typeof propertyData.features
        } : "No data");
        
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
        console.log("usePropertyFetch - Images fetched:", images.length);
        
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
          
          // Handle nearby_cities with fallback for older database entries
          let nearby_cities: PropertyCity[] = [];
          
          try {
            // Use type assertion to safely access the property
            const dbData = propertyData as any;
            
            if (dbData && typeof dbData === 'object' && 'nearby_cities' in dbData) {
              nearby_cities = safeParseArray(dbData.nearby_cities);
            } else {
              console.warn('No nearby_cities property found in database record, using empty array');
              nearby_cities = [];
            }
          } catch (error) {
            console.warn('Error parsing nearby_cities, using empty array', error);
            nearby_cities = [];
          }
          
          // Process agent data for backward compatibility
          const agentId = propertyData.agent_id;
          let agentData: PropertyAgent | undefined;
          
          if (agentId) {
            // Fetch agent information from profiles table
            const { data: agentProfile } = await supabase
              .from('profiles')
              .select('id, full_name, email, phone, avatar_url')
              .eq('id', agentId)
              .single();
            
            if (agentProfile) {
              agentData = {
                id: agentProfile.id,
                name: agentProfile.full_name || 'Unknown Agent',
                email: agentProfile.email,
                phone: agentProfile.phone,
                photoUrl: agentProfile.avatar_url
              };
            } else {
              agentData = {
                id: agentId,
                name: 'Unknown Agent'
              };
            }
          }
          
          // Convert featuredImages to PropertyImages for coverImages
          const coverImages = featuredImages.map(url => ({
            id: `cover-${Date.now()}-${Math.random()}`,
            url
          }));
          
          // Safely access metadata and status
          // Treat propertyData as any to avoid type errors during this transition
          const propertyDataAny = propertyData as any;
          const metadata = propertyDataAny.metadata || {};
          const status = 
            propertyDataAny.metadata?.status || 
            propertyDataAny.status || 
            'Draft';

          // Convert areaPhotos to PropertyImage[] if they exist
          const areaPhotos: PropertyImage[] = Array.isArray(propertyData.areaPhotos) ? 
            propertyData.areaPhotos.map((url: string) => ({
              id: `area-${Date.now()}-${Math.random()}`,
              url
            })) : [];
          
          // Set the form data with safe defaults for new fields
          const updatedFormData = {
            ...initialFormData,
            ...propertyData,
            features,
            areas,
            nearby_places,
            nearby_cities,
            hasGarden: propertyData.hasGarden || false,
            images: regularImages,
            floorplans: floorplanImages,
            featuredImage: featuredImage,
            featuredImages: featuredImages,
            agent: agentData,
            shortDescription: propertyData.shortDescription || "", // Include shortDescription with fallback
            status, // Use the resolved status
            metadata, // Include the metadata field
            // Add backward compatibility fields
            coverImages, // Now as PropertyImage[]
            gridImages: regularImages.slice(0, 4), // Now as PropertyImage[]
            areaPhotos // Now as PropertyImage[]
          };
          
          console.log("usePropertyFetch - Setting form data with fields:", Object.keys(updatedFormData).length);
          console.log("usePropertyFetch - FormData ID:", updatedFormData.id);
          console.log("usePropertyFetch - FormData title:", updatedFormData.title);
          
          setFormData(updatedFormData);
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
