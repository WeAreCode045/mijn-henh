
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
    if (!onFieldChange || !formData.nearby_places) return;
    
    const newPlaces: PropertyNearbyPlace[] = selectedPlaces.map(place => ({
      id: place.id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      distance: place.distance || 0,
      type: place.type,
      visible_in_webview: true
    }));
    
    const existingPlaces = formData.nearby_places.filter(
      place => !newPlaces.some(newPlace => newPlace.id === place.id)
    );
    
    const updatedPlaces = [...existingPlaces, ...newPlaces];
    onFieldChange('nearby_places', updatedPlaces);
    
    // Save to database if we have a property ID
    if (formData.id) {
      try {
        const updatedPlacesJson = preparePropertiesForJsonField(updatedPlaces);
        
        const { error } = await supabase
          .from('properties')
          .update({ nearby_places: updatedPlacesJson })
          .eq('id', formData.id);
          
        if (error) {
          console.error("Error saving places to database:", error);
          throw error;
        }
        
        toast({
          title: "Places saved",
          description: `${selectedPlaces.length} places have been added.`
        });
      } catch (error) {
        console.error("Error updating database:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save places to database. Please try again.",
        });
      }
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
