
import { PropertyData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { transformFeatures, transformAreas, transformNearbyPlaces } from "@/hooks/property-form/propertyDataTransformer";
import { normalizeImages } from "@/utils/imageHelpers";

interface PropertyDataAdapterProps {
  supabaseData: any;
  children: (propertyData: PropertyData) => React.ReactNode;
}

export function PropertyDataAdapter({ supabaseData, children }: PropertyDataAdapterProps) {
  if (!supabaseData) {
    return null;
  }

  // Parse string JSON fields or use provided objects
  let features = [];
  try {
    features = Array.isArray(supabaseData.features) 
      ? supabaseData.features 
      : (typeof supabaseData.features === 'string' 
          ? JSON.parse(supabaseData.features) 
          : []);
  } catch (e) {
    console.error('Error parsing features:', e);
  }

  let areas = [];
  try {
    areas = Array.isArray(supabaseData.areas) 
      ? supabaseData.areas 
      : (typeof supabaseData.areas === 'string' 
          ? JSON.parse(supabaseData.areas) 
          : []);
  } catch (e) {
    console.error('Error parsing areas:', e);
  }

  let nearby_places = [];
  try {
    nearby_places = Array.isArray(supabaseData.nearby_places) 
      ? supabaseData.nearby_places 
      : (typeof supabaseData.nearby_places === 'string' 
          ? JSON.parse(supabaseData.nearby_places) 
          : []);
  } catch (e) {
    console.error('Error parsing nearby_places:', e);
  }

  // Transform data into typed objects
  const transformedFeatures = transformFeatures(features);
  const transformedAreas = transformAreas(areas);
  const transformedNearbyPlaces = transformNearbyPlaces(nearby_places);
  
  // Process images
  const images = normalizeImages(supabaseData.images || []);

  // Create standardized property data object
  const propertyData: PropertyData = {
    id: supabaseData.id,
    title: supabaseData.title || '',
    price: String(supabaseData.price || ''),
    address: supabaseData.address || '',
    bedrooms: String(supabaseData.bedrooms || ''),
    bathrooms: String(supabaseData.bathrooms || ''),
    sqft: String(supabaseData.sqft || ''),
    livingArea: String(supabaseData.livingArea || ''),
    buildYear: String(supabaseData.buildYear || ''),
    garages: String(supabaseData.garages || ''),
    energyLabel: String(supabaseData.energyLabel || ''),
    hasGarden: Boolean(supabaseData.hasGarden),
    description: supabaseData.description || '',
    location_description: supabaseData.location_description || '',
    features: transformedFeatures,
    images: images,
    areas: transformedAreas,
    nearby_places: transformedNearbyPlaces,
    object_id: supabaseData.object_id,
    agent_id: supabaseData.agent_id,
    template_id: supabaseData.template_id || 'default',
    virtualTourUrl: supabaseData.virtualTourUrl || '',
    youtubeUrl: supabaseData.youtubeUrl || '',
    notes: supabaseData.notes || '',
    map_image: supabaseData.map_image,
    latitude: supabaseData.latitude,
    longitude: supabaseData.longitude,
    floorplans: supabaseData.floorplans || [],
    floorplanEmbedScript: supabaseData.floorplanEmbedScript || '',
    featuredImage: supabaseData.featuredImage || null,
    featuredImages: supabaseData.featuredImages || [],
    coverImages: supabaseData.coverImages || [],
    gridImages: supabaseData.gridImages || [],
    areaPhotos: supabaseData.areaPhotos || [],
    created_at: supabaseData.created_at,
    updated_at: supabaseData.updated_at
  };

  return children(propertyData);
}
