import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PropertyDataAdapterProps {
  propertyId: string;
  children: (data: PropertyData | null, isLoading: boolean) => React.ReactNode;
}

export function PropertyDataAdapter({ propertyId, children }: PropertyDataAdapterProps) {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPropertyData() {
      if (!propertyId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch the property data
        const { data: property, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) {
          throw error;
        }

        // Fetch images from property_images table
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .order('sort_order', { ascending: true });

        if (imageError) {
          console.error('Error fetching property images:', imageError);
        }

        // Parse JSON fields
        const features = property.features ? 
          (typeof property.features === 'string' ? 
            JSON.parse(property.features) : property.features) : [];
        
        const areas = property.areas ? 
          (typeof property.areas === 'string' ? 
            JSON.parse(property.areas) : property.areas) : [];
        
        const nearby_places = property.nearby_places ? 
          (typeof property.nearby_places === 'string' ? 
            JSON.parse(property.nearby_places) : property.nearby_places) : [];
        
        const nearby_cities = property.nearby_cities ? 
          (typeof property.nearby_cities === 'string' ? 
            JSON.parse(property.nearby_cities) : property.nearby_cities) : [];

        // Filter images by type
        const images = imageData?.filter(img => img.type === 'image' || !img.type) || [];
        const floorplans = imageData?.filter(img => img.type === 'floorplan') || [];

        // Create the formatted property data
        const formData = {
          ...property,
          features,
          areas,
          nearby_places,
          nearby_cities,
          images,
          floorplans,
          hasGarden: property.hasGarden || false,
        };

        // Set the property data
        setPropertyData({
          ...formData,
          images: formData.images || [],
          floorplans: formData.floorplans || [],
          areas: formData.areas || [],
          features: formData.features || [],
          nearby_places: formData.nearby_places || [],
          nearby_cities: formData.nearby_cities || [],
          // Add backward compatibility fields if needed
          coverImages: formData.coverImages || formData.images?.slice(0, 6) || [],
          gridImages: formData.gridImages || formData.images?.slice(0, 4) || [],
        });
      } catch (error) {
        console.error('Error fetching property data:', error);
        toast({
          title: "Error",
          description: "Failed to load property data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPropertyData();
  }, [propertyId, toast]);

  return <>{children(propertyData, isLoading)}</>;
}
