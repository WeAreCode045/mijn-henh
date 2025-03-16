
import { useState, useEffect } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

// Safely parse JSON to the expected type
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
        // Fetch images from property_images table
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
        
        // Process images to PropertyImage objects with proper type
        const images: PropertyImage[] = rawImages.map(img => ({
          id: img.id,
          url: img.url,
          area: img.area,
          property_id: img.property_id,
          is_main: img.is_main,
          is_featured_image: img.is_featured_image,
          sort_order: img.sort_order,
          type: (img.type === "floorplan" ? "floorplan" : "image") as "image" | "floorplan" // Type casting
        }));
        
        // Parse complex data
        const features = safeParseJSON(propertyData.features, []);
        const areas = safeParseJSON(propertyData.areas, []);
        const nearby_places = safeParseJSON(propertyData.nearby_places, []);
        
        // Handle nearby_cities with proper checks
        let nearby_cities = [];
        if (propertyData.nearby_cities !== undefined) {
          nearby_cities = safeParseJSON(propertyData.nearby_cities, []);
        }
        
        // Filter images by type
        const regularImages = images.filter(img => img.type === 'image' || !img.type);
        const floorplanImages = images.filter(img => img.type === 'floorplan');
        
        // Find the main image
        const featuredImage = regularImages.find(img => img.is_main)?.url || null;
        
        // Get featured images
        const featuredImages = regularImages
          .filter(img => img.is_featured_image)
          .map(img => img.url);
          
        // Create coverImages for backward compatibility
        const coverImages = featuredImages.map(url => ({
          id: `cover-${Date.now()}-${Math.random()}`,
          url,
          type: "image" as "image" | "floorplan"
        }));
        
        // Ensure areas is an array
        const dataAreas = Array.isArray(areas) ? areas : [];
        
        // Transform areas to include images from property_images table
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

        // Ensure nearby_places has 'types' property
        const transformedNearbyPlaces = Array.isArray(nearby_places)
          ? nearby_places.map((place: any) => ({
              ...place,
              types: place.types || [place.type || "other"]
            }))
          : [];

        // Create the transformed property data with all required fields
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
          images: images,
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
          floorplans: floorplanImages,
          floorplanEmbedScript: propertyData.floorplanEmbedScript || "",
          coverImages: coverImages as PropertyImage[],
          gridImages: regularImages.slice(0, 4) as PropertyImage[],
          agent: propertyData.agent ? {
            id: propertyData.agent.id,
            name: propertyData.agent.full_name,
            email: propertyData.agent.email,
            phone: propertyData.agent.phone,
            photoUrl: propertyData.agent.avatar_url
          } : undefined
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
