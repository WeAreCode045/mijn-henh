
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
  longitude: null
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

        // Transform floorplans from array of URLs to array of objects with URL and columns
        const floorplans = Array.isArray(propertyData.floorplans)
          ? (typeof propertyData.floorplans[0] === 'string' 
              // Handle legacy format (array of strings)
              ? propertyData.floorplans.map((url: string) => ({ url, columns: 1 }))
              // Handle new format (array of objects)
              : propertyData.floorplans)
          : [];

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
          areaPhotos: propertyData.areaPhotos || []
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
