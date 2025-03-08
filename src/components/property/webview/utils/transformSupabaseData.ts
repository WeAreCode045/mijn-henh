
import { PropertyData, PropertyImage } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { Json } from "@/integrations/supabase/types";

export interface SupabasePropertyData {
  id: string;
  title: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  livingArea: string;
  buildYear: string;
  garages: string;
  energyLabel: string;
  hasGarden: boolean;
  description: string;
  location_description: string;
  features: any; // Using any to accommodate Json or array types
  areas: any; // Using any to accommodate Json or array types
  nearby_places: any; // Using any to accommodate Json or array types
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  agent_id: string | null;
  agent: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    photo_url: string;
  } | null;
  property_images: {
    id: string;
    url: string;
    property_id: string;
    is_main: boolean;
    is_featured_image: boolean;
    type: string;
    area: string | null;
  }[];
  created_at: string;
  updated_at: string;
  template_id: string;
  floorplanEmbedScript?: string; // Added explicit type for floorplanEmbedScript
}

export function transformSupabaseData(
  data: SupabasePropertyData,
  settings?: AgencySettings
): PropertyData {
  // Debug log for floorplan script
  console.log('transformSupabaseData - Processing property:', {
    id: data.id,
    hasFloorplanScript: !!data.floorplanEmbedScript,
    scriptLength: data.floorplanEmbedScript ? data.floorplanEmbedScript.length : 0,
    scriptType: typeof data.floorplanEmbedScript
  });

  // Extract images from property_images
  const images: PropertyImage[] = [];
  let featuredImage: string | null = null;
  const featuredImages: string[] = [];

  // Process property images
  if (data.property_images && data.property_images.length > 0) {
    data.property_images.forEach((img) => {
      if (img.type !== "floorplan") {
        // Regular image
        images.push({
          id: img.id,
          url: img.url,
          area: img.area,
        });

        // Check if this is the main image (previously featured)
        if (img.is_main) {
          featuredImage = img.url;
        }

        // Check if this is a featured image (previously grid image)
        if (img.is_featured_image) {
          featuredImages.push(img.url);
        }
      }
    });
  }

  // Ensure areas is an array
  const dataAreas = Array.isArray(data.areas) ? data.areas : [];
  
  // Transform areas to include imageIds
  const transformedAreas = dataAreas.map((area: any) => ({
    ...area,
    imageIds: data.property_images
      .filter((img) => img.area === area.id)
      .map((img) => img.id),
  }));

  // Ensure features is always an array
  const dataFeatures = Array.isArray(data.features) ? data.features : 
                      (data.features ? [data.features] : []);

  // Ensure nearby_places is always an array
  const nearbyPlaces = Array.isArray(data.nearby_places) ? data.nearby_places : 
                      (data.nearby_places ? [data.nearby_places] : []);

  // Create the transformed property data
  const transformedData: PropertyData = {
    id: data.id,
    title: data.title || "",
    price: data.price || "",
    address: data.address || "",
    bedrooms: data.bedrooms || "",
    bathrooms: data.bathrooms || "",
    sqft: data.sqft || "",
    livingArea: data.livingArea || "",
    buildYear: data.buildYear || "",
    garages: data.garages || "",
    energyLabel: data.energyLabel || "",
    hasGarden: data.hasGarden || false,
    description: data.description || "",
    location_description: data.location_description || "",
    features: dataFeatures,
    images: images,
    featuredImage: featuredImage,
    featuredImages: featuredImages,
    coverImages: featuredImages, // For backward compatibility
    areas: transformedAreas,
    nearby_places: nearbyPlaces,
    latitude: data.latitude,
    longitude: data.longitude,
    map_image: data.map_image,
    agent_id: data.agent_id,
    agent: data.agent
      ? {
          id: data.agent.id,
          name: data.agent.full_name,
          email: data.agent.email,
          phone: data.agent.phone,
          photoUrl: data.agent.photo_url,
        }
      : undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    template_id: data.template_id,
    floorplanEmbedScript: data.floorplanEmbedScript || "", // Ensure floorplanEmbedScript is passed through
    floorplans: [], // Add empty floorplans array
    gridImages: featuredImages // For backward compatibility with components that still use gridImages
  };

  console.log('transformSupabaseData - Returning transformed data with floorplan script:', {
    id: transformedData.id,
    hasFloorplanScript: !!transformedData.floorplanEmbedScript,
    scriptLength: transformedData.floorplanEmbedScript ? transformedData.floorplanEmbedScript.length : 0
  });

  return transformedData;
}
