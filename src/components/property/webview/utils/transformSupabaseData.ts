
import { PropertyData, PropertyImage } from "@/types/property";
import { AgencySettings } from "@/types/agency";

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
  features: any[];
  areas: any[];
  nearby_places: any[];
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
    is_featured: boolean;
    is_grid_image: boolean;
    type: string;
    area: string | null;
  }[];
  created_at: string;
  updated_at: string;
  template_id: string;
  floorplanEmbedScript: string;
}

export function transformSupabaseData(
  data: SupabasePropertyData,
  settings?: AgencySettings
): PropertyData {
  // Extract images from property_images
  const images: PropertyImage[] = [];
  const floorplans: any[] = [];
  let featuredImage: string | null = null;
  const coverImages: string[] = [];

  // Process property images
  if (data.property_images && data.property_images.length > 0) {
    data.property_images.forEach((img) => {
      if (img.type === "floorplan") {
        floorplans.push({
          id: img.id,
          url: img.url,
        });
      } else {
        // Regular image
        images.push({
          id: img.id,
          url: img.url,
          area: img.area,
        });

        // Check if this is the featured image
        if (img.is_featured) {
          featuredImage = img.url;
        }

        // Check if this is a grid/cover image
        if (img.is_grid_image) {
          coverImages.push(img.url);
        }
      }
    });
  }

  // Transform areas to include imageIds
  const transformedAreas = data.areas.map((area: any) => ({
    ...area,
    imageIds: data.property_images
      .filter((img) => img.area === area.id)
      .map((img) => img.id),
  }));

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
    features: data.features || [],
    images: images,
    floorplans: floorplans,
    featuredImage: featuredImage,
    coverImages: coverImages,
    areas: transformedAreas,
    nearby_places: data.nearby_places || [],
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
    floorplanEmbedScript: data.floorplanEmbedScript,
  };

  return transformedData;
}
