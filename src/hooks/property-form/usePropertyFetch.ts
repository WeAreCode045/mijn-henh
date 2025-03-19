
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
      full_name: 'Unknown Agent',
      email: '',
      phone: '',
    };
  }
  
  if (typeof agentData === 'object') {
    return {
      id: agentData.id || '',
      full_name: agentData.full_name || 'Unknown Agent',
      email: agentData.email || '',
      phone: agentData.phone || '',
      avatar_url: agentData.avatar_url,
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
      console.log("Fetching property data for ID:", id);
      
      try {
        // Fetch the property with related images and agent data in a single request
        const { data: propertyData, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(*),
            agent:profiles(id, full_name, email, phone, avatar_url)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        console.log("Raw property data:", propertyData);
        
        if (propertyData) {
          // Extract and process images from the joined data
          const imageData = propertyData.property_images || [];
          
          // Process images with proper type conversion
          const processedImages = imageData.map((img: any) => ({
            id: img.id,
            url: img.url,
            area: img.area,
            property_id: img.property_id,
            is_main: img.is_main,
            is_featured_image: img.is_featured_image,
            sort_order: img.sort_order,
            type: (img.type || "image") as "image" | "floorplan"
          }));
          
          // Filter images by type and flags
          const regularImages = processedImages.filter(img => img.type === 'image' || !img.type);
          const floorplanImages = processedImages.filter(img => img.type === 'floorplan');
          const featuredImage = regularImages.find(img => img.is_main)?.url || null;
          const featuredImages = regularImages
            .filter(img => img.is_featured_image)
            .map(img => img.url);
          
          console.log("Property data retrieved:", {
            title: propertyData.title,
            imagesCount: processedImages.length,
            floorplansCount: floorplanImages.length
          });
          
          // Parse JSON strings from the database to objects
          const features = safeParseArray(propertyData.features);
          const areas = safeParseArray(propertyData.areas);
          const nearby_places = safeParseArray(propertyData.nearby_places);
          const nearby_cities = safeParseArray(propertyData.nearby_cities || []);
          
          // Process agent data
          const agentData = propertyData.agent ? formatAgentData(propertyData.agent) : undefined;
          
          // Process generalInfo
          const generalInfo = formatGeneralInfo(propertyData.generalInfo) || {
            propertyDetails: {
              title: propertyData.title || '',
              price: propertyData.price || '',
              address: propertyData.address || '',
              objectId: propertyData.object_id || '',
            },
            description: {
              shortDescription: propertyData.shortDescription || propertyData.description || '',
              fullDescription: propertyData.description || '',
            },
            keyInformation: {
              buildYear: propertyData.buildYear || '',
              lotSize: propertyData.sqft || '',
              livingArea: propertyData.livingArea || '',
              bedrooms: propertyData.bedrooms || '',
              bathrooms: propertyData.bathrooms || '',
              energyClass: propertyData.energyLabel || '',
              garages: propertyData.garages || '',
              hasGarden: propertyData.hasGarden || false,
            }
          };
          
          // Get property type from either property_type or propertyType field
          const propertyType = propertyData.property_type || propertyData.propertyType || "";
          
          // Set the form data with all the processed values
          const updatedFormData: PropertyFormData = {
            ...initialFormData,
            ...propertyData,
            id: propertyData.id || "",
            title: propertyData.title || "",
            price: propertyData.price || "",
            address: propertyData.address || "",
            bedrooms: propertyData.bedrooms || "",
            bathrooms: propertyData.bathrooms || "",
            sqft: propertyData.sqft || "",
            livingArea: propertyData.livingArea || "",
            buildYear: propertyData.buildYear || "",
            garages: propertyData.garages || "",
            energyLabel: propertyData.energyLabel || "",
            hasGarden: propertyData.hasGarden || false,
            description: propertyData.description || "",
            shortDescription: propertyData.shortDescription || propertyData.description || "",
            features,
            areas,
            nearby_places,
            nearby_cities,
            images: convertToPropertyImageArray(regularImages),
            floorplans: convertToPropertyFloorplanArray(floorplanImages),
            featuredImage: featuredImage,
            featuredImages: featuredImages,
            agent: agentData,
            generalInfo, 
            coverImages: convertToPropertyImageArray(regularImages.filter(img => img.is_featured_image)),
            gridImages: convertToPropertyImageArray(regularImages.slice(0, 4)),
            areaPhotos: [],
            propertyType,
            virtualTourUrl: propertyData.virtualTourUrl || '',
            youtubeUrl: propertyData.youtubeUrl || '',
            floorplanEmbedScript: propertyData.floorplanEmbedScript || '',
            object_id: propertyData.object_id || '',
            agent_id: propertyData.agent_id || '',
            template_id: propertyData.template_id || 'default',
            latitude: propertyData.latitude || null,
            longitude: propertyData.longitude || null,
            location_description: propertyData.location_description || '',
            created_at: propertyData.created_at || new Date().toISOString(),
            updated_at: propertyData.updated_at || new Date().toISOString(),
          };
          
          console.log("Processed form data:", {
            title: updatedFormData.title,
            price: updatedFormData.price,
            address: updatedFormData.address,
            imagesCount: updatedFormData.images.length,
            features: updatedFormData.features.length,
            areas: updatedFormData.areas.length
          });
          
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
