
import { useState } from "react";
import { PlaceOption } from "../components/SelectPlacesModal";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { preparePropertiesForJsonField } from "@/hooks/property-form/preparePropertyData";
import { supabase } from "@/integrations/supabase/client";

export function useNearbyPlacesModal({
  formData,
  onFieldChange
}: {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [placesForModal, setPlacesForModal] = useState<PlaceOption[]>([]);
  const { toast } = useToast();

  const handleSavePlaces = async (selectedPlaces: PlaceOption[]) => {
    if (!onFieldChange || !formData.id) {
      toast({
        title: "Error",
        description: "Cannot save places: property ID is missing or change handler is not provided",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Transform selected places to our PropertyNearbyPlace format
      const newPlaces: PropertyNearbyPlace[] = selectedPlaces.map(place => ({
        id: place.id,
        name: place.name,
        vicinity: place.vicinity || "",
        rating: place.rating || null,
        user_ratings_total: place.user_ratings_total || 0,
        type: place.type || currentCategory,
        visible_in_webview: true,
        distance: place.distance || 0, // Ensure distance is included
        category: currentCategory, // Make sure the category is set
        latitude: place.latitude || null,
        longitude: place.longitude || null
      }));
      
      // Filter out duplicates from existing places
      const existingPlaces = formData.nearby_places || [];
      const existingFiltered = existingPlaces.filter(
        place => !newPlaces.some(newPlace => newPlace.id === place.id)
      );
      
      // Combine existing and new places
      const updatedPlaces = [...existingFiltered, ...newPlaces];
      
      // Update form state
      onFieldChange('nearby_places', updatedPlaces);
      
      // Save to database - convert to Json format for Supabase
      console.log("Saving places to database:", updatedPlaces);
      const jsonPlaces = preparePropertiesForJsonField(updatedPlaces);
      const { error } = await supabase
        .from('properties')
        .update({ nearby_places: jsonPlaces as any }) // Cast to any to resolve type issues
        .eq('id', formData.id);
          
      if (error) {
        console.error("Error saving places to database:", error);
        throw error;
      }
      
      toast({
        title: "Places saved",
        description: `${newPlaces.length} places have been added.`
      });
      
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating database:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save places to database. Please try again.",
      });
    }
  };

  return {
    modalOpen,
    setModalOpen,
    currentCategory,
    setCurrentCategory,
    placesForModal,
    setPlacesForModal,
    handleSavePlaces
  };
}
