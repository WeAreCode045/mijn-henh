
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyPlaceType, PropertyImage, PropertyArea, PropertyFloorplan } from "@/types/property";

const initialFormData: PropertyFormData = {
  title: "",
  price: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  livingArea: "",
  buildYear: "",
  garages: "",
  energyLabel: "",
  hasGarden: false,
  description: "",
  location_description: "",
  features: [],
  images: [],
  floorplans: [],
  featuredImage: null,
  gridImages: [],
  areas: [],
  map_image: null,
  nearby_places: [],
  latitude: null,
  longitude: null,
  template_id: "default", // Set default template_id
  floorplanEmbedScript: "" // Initialize floorplanEmbedScript property
};

export function usePropertyForm(id: string | undefined, onSubmit?: (data: PropertyFormData) => void) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      const { data: propertyData, error } = await supabase
        .from('properties')
        .select('*, property_images(id, url)')
        .eq('id', id)
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
        const features = Array.isArray(propertyData.features)
          ? propertyData.features.map((feature: any) => ({
              id: feature.id || String(Date.now()),
              description: feature.description || ""
            }))
          : [];

        const areas = Array.isArray(propertyData.areas)
          ? propertyData.areas.map((area: any) => ({
              id: area.id || crypto.randomUUID(),
              title: area.title || "",
              description: area.description || "",
              imageIds: Array.isArray(area.imageIds) ? area.imageIds : [],
              columns: typeof area.columns === 'number' ? area.columns : 2
            }))
          : [];

        console.log("Loaded areas with columns:", areas);

        // Transform floorplans from database format to PropertyFloorplan[]
        let floorplans: PropertyFloorplan[] = [];
        if (Array.isArray(propertyData.floorplans)) {
          floorplans = propertyData.floorplans.map((floorplan: any) => {
            if (typeof floorplan === 'string') {
              try {
                // Try to parse as JSON if it's a stringified object
                const parsedFloorplan = JSON.parse(floorplan);
                return {
                  id: parsedFloorplan.id || crypto.randomUUID(),
                  url: parsedFloorplan.url || '',
                  filePath: parsedFloorplan.filePath || '', 
                  columns: typeof parsedFloorplan.columns === 'number' ? parsedFloorplan.columns : 1
                };
              } catch (e) {
                // If parsing fails, treat it as a plain URL string
                return { 
                  id: crypto.randomUUID(),
                  url: floorplan, 
                  filePath: '', 
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
            } else {
              // Fallback for any other case
              return { 
                id: crypto.randomUUID(),
                url: '', 
                filePath: '',
                columns: 1 
              };
            }
          }).filter(f => f.url); // Filter out any items with empty URLs
        }

        console.log("Loaded floorplans:", floorplans);

        const nearbyPlaces = Array.isArray(propertyData.nearby_places)
          ? propertyData.nearby_places.map((place: any) => ({
              id: place.id || "",
              name: place.name || "",
              type: place.type || "",
              vicinity: place.vicinity || "",
              rating: place.rating || 0,
              user_ratings_total: place.user_ratings_total || 0
            }))
          : [];

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

  return {
    formData,
    setFormData,
    isLoading
  };
}
