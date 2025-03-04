
import { PropertyData, PropertySubmitData } from "@/types/property";

interface PropertyDataAdapterProps {
  property: PropertyData;
  children: (adaptedProperty: PropertySubmitData) => React.ReactNode;
}

export function PropertyDataAdapter({ property, children }: PropertyDataAdapterProps) {
  // Convert PropertyData to PropertySubmitData format
  const adaptedData: PropertySubmitData = {
    id: property.id,
    title: property.title,
    price: property.price,
    address: property.address,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.sqft,
    livingArea: property.livingArea,
    buildYear: property.buildYear,
    garages: property.garages,
    energyLabel: property.energyLabel,
    hasGarden: property.hasGarden,
    description: property.description,
    location_description: property.location_description,
    features: property.features,
    floorplans: property.floorplans,
    featuredImage: property.featuredImage,
    featuredImages: property.featuredImages || [], // Add this to fix the missing property error
    coverImages: property.coverImages || [],
    gridImages: property.gridImages || [],
    areas: property.areas,
    areaPhotos: property.areaPhotos,
    object_id: property.object_id,
    map_image: property.map_image,
    nearby_places: property.nearby_places || [],
    latitude: property.latitude,
    longitude: property.longitude,
    images: Array.isArray(property.images) 
      ? property.images.map(img => typeof img === 'string' ? img : img.url)
      : [],
    agent_id: property.agent_id || "",
    virtualTourUrl: property.virtualTourUrl,
    youtubeUrl: property.youtubeUrl,
    notes: property.notes,
    template_id: property.template_id || "default",
    floorplanEmbedScript: property.floorplanEmbedScript || "",
  };

  return children(adaptedData);
}
