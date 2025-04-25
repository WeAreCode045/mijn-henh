
import { PropertyData, PropertyImage, PropertyFeature, PropertyArea, PropertyNearbyPlace } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { Json } from "@/integrations/supabase/types";

interface SupabasePropertyData {
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
  features: Json[] | Json | null;
  areas: Array<{
    id: string;
    title?: string;
    name?: string;
    description?: string;
    size?: string;
    images?: Array<{
      url: string;
      id?: string;
    }>;
  }> | Json | null;
  nearby_places: Json[] | Json | null;
  latitude: number | null;
  longitude: number | null;
  map_image: string | null;
  agent_id: string | null;
  object_id: string | null;
  agent: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string; // This is the field from the database
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
  template_id?: string; // Make this optional since template functionality is removed
  floorplanEmbedScript?: string;
  propertyType?: string; // Add propertyType property
  virtualTourUrl?: string | null;
  youtubeUrl?: string | null;
}

export function transformSupabaseData(
  data: SupabasePropertyData,
  settings?: AgencySettings
): PropertyData {
  // Debug log for incoming data
  console.log('transformSupabaseData - Processing property:', {
    id: data.id,
    objectId: data.object_id,
    hasFloorplanScript: !!data.floorplanEmbedScript,
    scriptLength: data.floorplanEmbedScript ? data.floorplanEmbedScript.length : 0,
    scriptType: typeof data.floorplanEmbedScript,
    imageCount: data.property_images?.length || 0
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
  
  // Debug log for areas data
  console.log('Raw areas data:', dataAreas);

  // Transform areas and extract image URLs from the JSONB data
  const transformedAreas: PropertyArea[] = dataAreas.map((area: { 
    id: string; 
    title?: string; 
    name?: string; 
    description?: string; 
    size?: string;
    images?: Array<{ url: string; id?: string; }>;
  }) => {
    // Debug log for each area's images
    console.log(`Area ${area.id || 'unknown'} images:`, area.images);
    
    // Ensure all required properties are present
    return {
      id: area.id,
      title: area.title || '',
      name: area.name || area.title || `Area ${area.id.substring(0, 4)}`, // Ensure name is always defined
      description: area.description || '',
      size: area.size || '',
      images: area.images?.map(img => img.url) || [],
      imageIds: [], // Required property in PropertyArea
      columns: 2 // Default value
    };
  });

  // Debug log for transformed areas
  console.log('Transformed areas with image URLs:', transformedAreas);

  // Transform features to ensure they match the PropertyFeature type
  const transformFeatures = (features: any): PropertyFeature[] => {
    if (!features) return [];
    
    const featureArray = Array.isArray(features) ? features : [features];
    
    return featureArray.map((feature: any) => {
      // If feature is already a PropertyFeature object with description
      if (typeof feature === 'object' && feature.description) {
        return {
          id: feature.id || `feature-${Math.random().toString(36).substr(2, 9)}`,
          description: feature.description
        };
      }
      
      // If feature is just a string
      if (typeof feature === 'string') {
        return {
          id: `feature-${Math.random().toString(36).substr(2, 9)}`,
          description: feature
        };
      }
      
      // Default case with empty description
      return {
        id: `feature-${Math.random().toString(36).substr(2, 9)}`,
        description: 'Unknown feature'
      };
    });
  };

  // Transform nearby places to ensure they match PropertyNearbyPlace type
  const transformNearbyPlaces = (places: any): PropertyNearbyPlace[] => {
    if (!places) return [];
    
    const placesArray = Array.isArray(places) ? places : [places];
    
    return placesArray.map((place: any) => {
      if (typeof place === 'object') {
        return {
          id: place.id || `place-${Math.random().toString(36).substr(2, 9)}`,
          name: place.name || 'Unknown place',
          distance: place.distance || '0',
          type: place.type || 'unknown'
        };
      }
      
      // Default case if place is not an object
      return {
        id: `place-${Math.random().toString(36).substr(2, 9)}`,
        name: typeof place === 'string' ? place : 'Unknown place',
        distance: '0',
        type: 'unknown'
      };
    });
  };

  // Create the transformed property data
  const transformedData: PropertyData = {
    id: data.id,
    object_id: data.object_id || undefined,
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
    features: transformFeatures(data.features),
    images: images,
    featuredImage: featuredImage,
    featuredImages: featuredImages,
    areas: transformedAreas,
    nearby_places: transformNearbyPlaces(data.nearby_places),
    latitude: data.latitude,
    longitude: data.longitude,
    map_image: data.map_image,
    agent_id: data.agent_id,
    propertyType: data.propertyType || "", // Include propertyType in the transformed data
    agent: data.agent
      ? {
          id: data.agent.id,
          name: data.agent.full_name,
          email: data.agent.email,
          phone: data.agent.phone,
          photoUrl: data.agent.avatar_url, // Map avatar_url to photoUrl
        }
      : undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    template_id: data.template_id || "default",
    floorplanEmbedScript: data.floorplanEmbedScript || "",
    floorplans: [],
    virtualTourUrl: data.virtualTourUrl || "",
    youtubeUrl: data.youtubeUrl || ""
  };

  console.log('transformSupabaseData - Returning transformed data:', {
    id: transformedData.id,
    objectId: transformedData.object_id,
    hasFloorplanScript: !!transformedData.floorplanEmbedScript,
    scriptLength: transformedData.floorplanEmbedScript ? transformedData.floorplanEmbedScript.length : 0,
    imageCount: transformedData.images.length,
    areaCount: transformedData.areas.length,
    virtualTourUrl: transformedData.virtualTourUrl,
    youtubeUrl: transformedData.youtubeUrl,
    featuresCount: transformedData.features.length
  });

  return transformedData;
}
