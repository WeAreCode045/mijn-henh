
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from "@/types/property";
import { 
  transformFeatures, 
  transformAreas, 
  transformFloorplans, 
  transformNearbyPlaces 
} from "./propertyDataTransformer";
import { initialFormData } from "./initialFormData";

export function usePropertyFetch(id: string | undefined) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      fetchPropertyData(id);
    }
  }, [id]);

  const fetchPropertyData = async (propertyId: string) => {
    try {
      const { data: propertyData, error } = await supabase
        .from('properties')
        .select('*, property_images(id, url)')
        .eq('id', propertyId)
        .single();

      if (error) {
        console.error('Fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load property data",
          variant: "destructive",
        });
        return;
      }

      if (propertyData) {
        const features = transformFeatures(propertyData.features || []);
        const areas = transformAreas(propertyData.areas || []);
        
        console.log("Loaded areas with columns:", areas);

        // Transform floorplans from database format to PropertyFloorplan[]
        const floorplans = transformFloorplans(propertyData.floorplans || []);
        
        console.log("Loaded floorplans:", floorplans);

        const nearbyPlaces = transformNearbyPlaces(propertyData.nearby_places || []);
        const images: PropertyImage[] = propertyData.property_images || [];

        // Cast propertyData to any to allow accessing template_id since it might not be in the type
        const propertyDataAny = propertyData as any;

        setFormData({
          id: propertyData.id,
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
          hasGarden: Boolean(propertyData.hasGarden),
          description: propertyData.description || "",
          location_description: propertyData.location_description || "",
          features: features,
          images: images,
          floorplans: floorplans,
          featuredImage: propertyData.featuredImage,
          gridImages: Array.isArray(propertyData.gridImages) ? propertyData.gridImages : [],
          areas: areas,
          map_image: propertyData.map_image || null,
          nearby_places: nearbyPlaces,
          latitude: propertyData.latitude || null,
          longitude: propertyData.longitude || null,
          areaPhotos: propertyData.areaPhotos || [],
          created_at: propertyData.created_at,
          updated_at: propertyData.updated_at,
          virtualTourUrl: propertyData.virtualTourUrl || "",
          youtubeUrl: propertyData.youtubeUrl || "",
          notes: propertyData.notes || "",
          // Use the casted version to access template_id or use default
          template_id: propertyDataAny.template_id || "default",
          agent_id: propertyData.agent_id,
          // Access floorplanEmbedScript from propertyDataAny to avoid TypeScript errors
          floorplanEmbedScript: propertyDataAny.floorplanEmbedScript || ""
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load property data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return { formData, setFormData, isLoading };
}
