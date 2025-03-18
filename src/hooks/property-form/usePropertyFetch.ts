import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData, PropertyImage, PropertyAgent, PropertyCity, PropertyFloorplan, GeneralInfoData } from "@/types/property";
import { initialFormData } from "./initialFormData";
import { convertToPropertyImageArray, convertToPropertyFloorplanArray } from "@/utils/propertyDataAdapters";

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
      email: '',
      phone: '',
    };
  }
  
  if (typeof agentData === 'object') {
    return {
      id: agentData.id || '',
      name: agentData.name || agentData.full_name || 'Unknown Agent',
      email: agentData.email || '',
      phone: agentData.phone || '',
      photoUrl: agentData.avatar_url, // Using avatar_url instead of agent_photo
      address: agentData.address,
    };
  }
  
  return undefined;
};

// Helper function to safely convert generalInfo
const formatGeneralInfo = (data: any): GeneralInfoData | undefined => {
  if (!data) return undefined;
  
  // If it's already an object with the right shape, return it
  if (typeof data === 'object' && !Array.isArray(data)) {
    // Check if it has at least one expected property
    if ('propertyDetails' in data || 'description' in data || 'keyInformation' in data) {
      return data as GeneralInfoData;
    }
  }
  
  // If it's a string, try to parse it to an object
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as GeneralInfoData;
      }
    } catch (e) {
      // Failed to parse, return undefined
      return undefined;
    }
  }
  
  // Return undefined if we couldn't convert to GeneralInfoData
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
        
        // Process images with proper type conversion
        const processedImages = imageData ? imageData.map((img: any) => ({
          id: img.id,
          url: img.url,
          area: img.area,
          property_id: img.property_id,
          is_main: img.is_main,
          is_featured_image: img.is_featured_image,
          sort_order: img.sort_order,
          type: (img.type || "image") as "image" | "floorplan"
        })) : [];
        
        // Filter images by type and flags
        const regularImages = processedImages.filter(img => img.type === 'image' || !img.type);
        const floorplanImages = processedImages.filter(img => img.type === 'floorplan');
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
                email: agentProfile.email || '',
                phone: agentProfile.phone || '',
                photoUrl: agentProfile.avatar_url
              };
            } else {
              agentData = {
                id: agentId,
                name: 'Unknown Agent',
                email: '',
                phone: '',
              };
            }
          }
          
          // Process generalInfo
          const generalInfo = formatGeneralInfo(propertyData.generalInfo);
          
          // Get property type from either property_type or propertyType field
          const propertyType = ((propertyData as any).property_type || (propertyData as any).propertyType || "");
          
          // Set the form data with safe defaults for new fields
          const updatedFormData: PropertyFormData = {
            ...initialFormData,
            ...propertyData,
            id: propertyData.id || "",
            title: propertyData.title || "",
            features,
            areas,
            nearby_places,
            nearby_cities,
            hasGarden: propertyData.hasGarden || false,
            images: convertToPropertyImageArray(regularImages),
            floorplans: convertToPropertyFloorplanArray(floorplanImages),
            featuredImage: featuredImage,
            featuredImages: featuredImages,
            agent: agentData,
            generalInfo, 
            coverImages: convertToPropertyImageArray(regularImages.filter(img => img.is_featured_image)),
            gridImages: convertToPropertyImageArray(regularImages.slice(0, 4)),
            areaPhotos: [],
            // Map property_type to propertyType for consistency
            propertyType
          };
          
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
