
import { PropertyData } from "@/types/property";

/**
 * Transforms Supabase raw data into PropertyData format
 */
export function transformSupabaseData(data: any): PropertyData {
  const features = parseJsonField(data.features, []);
  const areas = parseJsonField(data.areas, []);
  const nearby_places = parseJsonField(data.nearby_places, []);
  const nearby_cities = parseJsonField(data.nearby_cities, []);
  
  // Normalize agent data to match our PropertyAgent type
  const agentData = data.agent ? {
    id: data.agent.id,
    name: data.agent.full_name || data.agent.name || 'Unknown',
    email: data.agent.email,
    phone: data.agent.phone,
    photoUrl: data.agent.avatar_url || data.agent.photoUrl
  } : undefined;
  
  // Normalize property images
  const propertyImages = Array.isArray(data.property_images) 
    ? data.property_images.map((img: any) => ({
        id: img.id,
        url: img.url,
        property_id: img.property_id,
        is_main: img.is_main,
        is_featured_image: img.is_featured_image,
        sort_order: img.sort_order || 0,
        type: (img.type || 'image') as 'image' | 'floorplan'
      }))
    : [];
  
  // Separate regular images and floorplans
  const regularImages = propertyImages.filter(img => img.type === 'image' || !img.type);
  const floorplanImages = propertyImages.filter(img => img.type === 'floorplan');
  
  // Find the featured image
  const featuredImage = regularImages.find(img => img.is_main)?.url || null;
  
  // Get the property type
  const propertyType = data.property_type || data.propertyType || '';
  
  // Create shortDescription if it doesn't exist
  const shortDescription = data.shortDescription || data.description || '';
  
  return {
    id: data.id || '',
    title: data.title || '',
    price: data.price || '',
    address: data.address || '',
    bedrooms: data.bedrooms || '',
    bathrooms: data.bathrooms || '',
    sqft: data.sqft || '',
    livingArea: data.livingArea || '',
    buildYear: data.buildYear || '',
    garages: data.garages || '',
    energyLabel: data.energyLabel || '',
    hasGarden: !!data.hasGarden,
    description: data.description || '',
    shortDescription,
    location_description: data.location_description || '',
    features,
    images: regularImages,
    featuredImage,
    featuredImages: regularImages.filter(img => img.is_featured_image),
    areas,
    nearby_places,
    nearby_cities,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    map_image: data.map_image || null,
    object_id: data.object_id || '',
    agent_id: data.agent_id || '',
    template_id: data.template_id || 'default',
    agent: agentData,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    floorplans: floorplanImages,
    floorplanEmbedScript: data.floorplanEmbedScript || '',
    virtualTourUrl: data.virtualTourUrl || '',
    youtubeUrl: data.youtubeUrl || '',
    coverImages: regularImages.filter(img => img.is_featured_image),
    gridImages: regularImages.slice(0, 4),
    propertyType
  };
}

/**
 * Safely parse JSON string to object
 */
function parseJsonField<T>(field: any, defaultValue: T): T {
  if (!field) return defaultValue;
  
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch (e) {
      console.error('Error parsing JSON field:', e);
      return defaultValue;
    }
  }
  
  if (Array.isArray(field)) {
    return field as unknown as T;
  }
  
  return defaultValue;
}
