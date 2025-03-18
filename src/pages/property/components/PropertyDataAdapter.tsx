
import { useState, useEffect } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { convertToPropertyImageArray, convertToPropertyFloorplanArray } from "@/utils/propertyDataAdapters";

const safeParseJSON = <T,>(value: string | null | undefined, defaultValue: T): T => {
  if (!value) return defaultValue;
  
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return defaultValue;
  }
};

interface PropertyDataAdapterProps {
  propertyData: any;
  children: (property: PropertyData) => React.ReactNode;
}

export function PropertyDataAdapter({ propertyData, children }: PropertyDataAdapterProps) {
  const [property, setProperty] = useState<PropertyData | null>(null);
  
  useEffect(() => {
    async function processProperty() {
      if (!propertyData) return;
      
      try {
        let rawImages: any[] = [];
        
        if (propertyData.id) {
          const { data: imageData, error: imageError } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyData.id)
            .order('sort_order', { ascending: true });
            
          if (imageError) {
            console.error('Error fetching property images:', imageError);
          } else {
            rawImages = imageData || [];
          }
        }
        
        const images = rawImages.map(img => ({
          id: img.id,
          url: img.url,
          area: img.area,
          property_id: img.property_id,
          is_main: img.is_main,
          is_featured_image: img.is_featured_image,
          sort_order: img.sort_order,
          type: (img.type === "floorplan" ? "floorplan" : "image") as "image" | "floorplan"
        }));
        
        const features = safeParseJSON(propertyData.features, []);
        const areas = safeParseJSON(propertyData.areas, []);
        const nearby_places = safeParseJSON(propertyData.nearby_places, []);
        
        let nearby_cities = [];
        if (propertyData.nearby_cities !== undefined) {
          nearby_cities = safeParseJSON(propertyData.nearby_cities, []);
        }
        
        const regularImages = images.filter(img => img.type === 'image' || !img.type);
        const floorplanImages = images.filter(img => img.type === 'floorplan');
        
        const featuredImage = regularImages.find(img => img.is_main)?.url || null;
        
        const featuredImages = regularImages
          .filter(img => img.is_featured_image)
          .map(img => img.url);
        
        const dataAreas = Array.isArray(areas) ? areas : [];
        
        const transformedAreas = dataAreas.map((area: any) => ({
          ...area,
          images: images
            .filter((img) => img.area === area.id)
            .map((img) => ({
              id: img.id,
              url: img.url,
              area: img.area,
              type: img.type as "image" | "floorplan"
            }))
        }));

        const transformedNearbyPlaces = Array.isArray(nearby_places)
          ? nearby_places.map((place: any) => ({
              ...place,
              types: place.types || [place.type || "other"]
            }))
          : [];

        const transformedData: PropertyData = {
          id: propertyData.id || "",
          object_id: propertyData.object_id || "",
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
          location_description: propertyData.location_description || "",
          features: features,
          images: convertToPropertyImageArray(regularImages),
          featuredImage: featuredImage,
          featuredImages: featuredImages,
          areas: transformedAreas,
          nearby_places: transformedNearbyPlaces,
          nearby_cities: nearby_cities,
          latitude: propertyData.latitude || null,
          longitude: propertyData.longitude || null,
          map_image: propertyData.map_image || null,
          agent_id: propertyData.agent_id || "",
          template_id: propertyData.template_id || "default",
          virtualTourUrl: propertyData.virtualTourUrl || "",
          youtubeUrl: propertyData.youtubeUrl || "",
          created_at: propertyData.created_at || new Date().toISOString(),
          updated_at: propertyData.updated_at || new Date().toISOString(),
          floorplans: convertToPropertyFloorplanArray(floorplanImages),
          floorplanEmbedScript: propertyData.floorplanEmbedScript || "",
          coverImages: convertToPropertyImageArray(regularImages.filter(img => img.is_featured_image)),
          gridImages: convertToPropertyImageArray(regularImages.slice(0, 4)),
          agent: propertyData.agent ? {
            id: propertyData.agent.id,
            name: propertyData.agent.full_name,
            email: propertyData.agent.email,
            phone: propertyData.agent.phone,
            photoUrl: propertyData.agent.avatar_url
          } : undefined,
          propertyType: propertyData.property_type || propertyData.propertyType || "",
          property_type: propertyData.property_type || propertyData.propertyType || ""
        };
        
        setProperty(transformedData);
      } catch (error) {
        console.error("Error processing property data:", error);
        setProperty(null);
      }
    }
    
    processProperty();
  }, [propertyData]);
  
  if (!property) {
    return <div>Loading property data...</div>;
  }
  
  return <>{children(property)}</>;
}
