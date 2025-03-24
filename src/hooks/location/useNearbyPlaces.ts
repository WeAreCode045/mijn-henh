
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";

export function useNearbyPlaces(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPlaces = useCallback(async (category: string): Promise<any> => {
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Property coordinates are required to fetch nearby places",
        variant: "destructive"
      });
      return null;
    }
    
    console.log(`Fetching nearby places for category: ${category}`);
    console.log(`Coordinates: ${formData.latitude}, ${formData.longitude}`);
    
    setIsLoading(true);
    
    try {
      // Call the nearby-places edge function
      const { data, error } = await supabase.functions.invoke("nearby-places", {
        body: {
          category,
          latitude: formData.latitude,
          longitude: formData.longitude,
          radius: 5000,
          propertyId: formData.id,
          apiKey: process.env.GOOGLE_MAPS_API_KEY || ""
        }
      });
      
      if (error) {
        console.error("Error fetching nearby places:", error);
        throw error;
      }
      
      console.log("Nearby places API response:", data);
      
      if (!data || Object.keys(data).length === 0) {
        console.log("No places found for category:", category);
        toast({
          title: "No places found",
          description: `No ${category} places found near this location.`,
          variant: "default"
        });
        return null;
      }
      
      // For a single category search, add the places to the current list
      if (category && data[category]) {
        const existingPlaces = formData.nearby_places || [];
        const newPlaces = data[category] as PropertyNearbyPlace[];
        
        // Combine existing and new places, avoiding duplicates by ID
        const combinedPlaces = [
          ...existingPlaces,
          ...newPlaces.filter(newPlace => 
            !existingPlaces.some(existingPlace => existingPlace.id === newPlace.id)
          )
        ];
        
        // Update the form data with the combined places
        onFieldChange("nearby_places", combinedPlaces);
        
        toast({
          title: "Places found",
          description: `Found ${newPlaces.length} ${category} places nearby.`
        });
      }
      
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Error in fetchPlaces:", error);
      toast({
        title: "Error",
        description: `Failed to fetch ${category} places. Please try again.`,
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  }, [formData.id, formData.latitude, formData.longitude, formData.nearby_places, onFieldChange, toast]);

  const removePlaceAtIndex = useCallback((index: number) => {
    if (!formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces.splice(index, 1);
    
    onFieldChange("nearby_places", updatedPlaces);
    
    toast({
      title: "Place removed",
      description: "Nearby place has been removed successfully"
    });
  }, [formData.nearby_places, onFieldChange, toast]);

  return {
    fetchPlaces,
    removePlaceAtIndex,
    isLoading
  };
}
