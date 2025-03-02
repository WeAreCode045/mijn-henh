
import { PropertyData, PropertyFeature, PropertyImage, PropertyArea, PropertyAgent, PropertyFloorplan } from "@/types/property";

export function transformSupabaseData(data: any): PropertyData {
  // Process features array or object
  const features: PropertyFeature[] = Array.isArray(data.features) 
    ? data.features.map((feature: any) => ({
        id: feature.id || crypto.randomUUID(),
        description: feature.description || ""
      }))
    : [];

  // Process areas (if it exists)
  const areas: PropertyArea[] = Array.isArray(data.areas)
    ? data.areas.map((area: any) => ({
        id: area.id || crypto.randomUUID(),
        title: area.title || "",
        description: area.description || "",
        imageIds: Array.isArray(area.imageIds) ? area.imageIds : [],
        columns: typeof area.columns === 'number' ? area.columns : 2 // Ensure columns is preserved
      }))
    : [];

  console.log("transformSupabaseData - raw areas data:", data.areas);
  console.log("transformSupabaseData - processed areas:", areas);

  // Process images from property_images relation
  const images: PropertyImage[] = Array.isArray(data.property_images)
    ? data.property_images.map((img: any) => ({
        id: img.id,
        url: img.url
      }))
    : [];

  // Process floorplans
  const floorplans: PropertyFloorplan[] = Array.isArray(data.floorplans)
    ? data.floorplans.map((floorplan: any) => {
        if (typeof floorplan === 'string') {
          try {
            // Try to parse as JSON string
            const parsedFloorplan = JSON.parse(floorplan);
            return {
              id: parsedFloorplan.id || crypto.randomUUID(),
              url: parsedFloorplan.url || '',
              filePath: parsedFloorplan.filePath || '',
              columns: typeof parsedFloorplan.columns === 'number' ? parsedFloorplan.columns : 1
            };
          } catch (e) {
            // If parsing fails, treat as a simple URL string
            return { 
              id: crypto.randomUUID(),
              url: floorplan, 
              columns: 1 
            };
          }
        } else if (typeof floorplan === 'object' && floorplan !== null) {
          // If it's already an object
          return {
            id: floorplan.id || crypto.randomUUID(),
            url: floorplan.url || '',
            filePath: floorplan.filePath || '',
            columns: typeof floorplan.columns === 'number' ? floorplan.columns : 1
          };
        }
        // Default case
        return { 
          id: crypto.randomUUID(),
          url: '', 
          columns: 1 
        };
      }).filter(f => f.url) // Filter out items with empty URLs
    : [];

  // Process agent data if available
  const agent: PropertyAgent | undefined = data.agent_id ? {
    id: data.agent_id,
    name: data.agent_name || "",
    email: data.agent_email || "",
    phone: data.agent_phone || "",
    photoUrl: data.agent_photo || "",
    address: data.agent_address || ""
  } : undefined;

  // Return the transformed property data
  return {
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
    hasGarden: Boolean(data.hasGarden),
    description: data.description || "",
    location_description: data.location_description || "",
    features: features,
    images: images,
    floorplans: floorplans,
    featuredImage: data.featuredImage || null,
    gridImages: Array.isArray(data.gridImages) ? data.gridImages : [],
    areas: areas,
    object_id: data.object_id || undefined,
    map_image: data.map_image || null,
    nearby_places: data.nearby_places || [],
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    agent_id: data.agent_id || undefined,
    agent: agent,
    virtualTourUrl: data.virtualTourUrl || '',
    youtubeUrl: data.youtubeUrl || '',
    notes: data.notes || '',
    template_id: data.template_id || undefined,
    floorplanEmbedScript: data.floorplanEmbedScript || ''
  };
}
