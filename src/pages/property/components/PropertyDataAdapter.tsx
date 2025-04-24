
import { useState, useEffect } from "react";
import { PropertyData, PropertyImage, PropertyCity } from "@/types/property";
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
        // Debug logging for media URLs
        console.log('Raw property data:', {
          virtualTourUrl: propertyData.virtualTourUrl,
          youtubeUrl: propertyData.youtubeUrl,
          rawData: propertyData
        });
        // Fetch images from property_images table
        let images: PropertyImage[] = [];
        
        if (propertyData.id) {
          const { data: imageData, error: imageError } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyData.id)
            .order('sort_order', { ascending: true });
            
          if (imageError) {
            console.error('Error fetching property images:', imageError);
          } else {
            images = imageData || [];
          }
        }
        
        // Parse complex data
        const features = safeParseJSON(propertyData.features, []);
        const areas = safeParseJSON(propertyData.areas, []);
        const nearby_places = safeParseJSON(propertyData.nearby_places, []);
        const metadata = safeParseJSON(propertyData.metadata, { status: propertyData.status || 'Draft' });
        
        // Handle nearby_cities with proper checks
        let nearby_cities: PropertyCity[] = [];
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
          url
        }));
        
        // Determine status from metadata or direct property field
        const status = metadata?.status || propertyData.status || 'Draft';
        
        // Debug log for media URLs
        console.log('PropertyDataAdapter - Media URLs:', {
          virtualTourUrl: propertyData.virtualTourUrl,
          youtubeUrl: propertyData.youtubeUrl
        });

        // Create the structured property data
        const structuredProperty: PropertyData = {
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
          location_description: propertyData.location_description || "",
          features,
          areas,
          nearby_places,
          nearby_cities,
          images: regularImages,
          map_image: propertyData.map_image || null,
          latitude: propertyData.latitude || null,
          longitude: propertyData.longitude || null,
          floorplans: floorplanImages,
          object_id: propertyData.object_id || "",
          agent_id: propertyData.agent_id || "",
          template_id: propertyData.template_id || "default",
          virtualTourUrl: propertyData.virtualTourUrl || "",
          youtubeUrl: propertyData.youtubeUrl || "",
          notes: propertyData.notes || "",
          featuredImage,
          featuredImages,
          floorplanEmbedScript: propertyData.floorplanEmbedScript || "",
          created_at: propertyData.created_at,
          updated_at: propertyData.updated_at,
          status,
          propertyType: propertyData.propertyType || "", // Include propertyType
          // Add backward compatibility fields
          coverImages, // Now as PropertyImage[]
          gridImages: regularImages.slice(0, 4) // Now as PropertyImage[]
        };
        
        setProperty(structuredProperty);
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
