
import { useState } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { PlaceOption } from "../components/SelectPlacesModal";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { preparePropertiesForJsonField } from "@/hooks/property-form/preparePropertyData";
import { useCategories } from "./useCategories";

export function useNearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchNearbyPlaces,
  isLoadingNearbyPlaces
}: {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchNearbyPlaces?: (category?: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
}) {
  const nearbyPlaces = formData.nearby_places || [];
  const [activeTab, setActiveTab] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [placesForModal, setPlacesForModal] = useState<PlaceOption[]>([]);
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);
  const [selectedPlacesToDelete, setSelectedPlacesToDelete] = useState<number[]>([]);
  const { toast } = useToast();
  
  // Use the dedicated categories hook
  const { categories, groupPlacesByCategory } = useCategories();
  
  // Create the placesByCategory object using the helper from useCategories
  const placesByCategory = groupPlacesByCategory(nearbyPlaces);
  
  const handleFetchCategory = async (category: string) => {
    if (!onFetchNearbyPlaces) return;
    
    setIsFetchingCategory(true);
    setCurrentCategory(category);
    
    try {
      const results = await onFetchNearbyPlaces(category);
      if (results && results[category]) {
        const options: PlaceOption[] = results[category].map((place: any) => ({
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          distance: place.distance,
          type: category
        }));
        
        setPlacesForModal(options);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setIsFetchingCategory(false);
    }
  };
  
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
  
  const togglePlaceVisibility = (placeIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.map((place, idx) => 
      idx === placeIndex ? { ...place, visible_in_webview: visible } : place
    );
    
    onFieldChange('nearby_places', updatedPlaces);
  };

  const togglePlaceSelection = (placeIndex: number, selected: boolean) => {
    if (selected) {
      setSelectedPlacesToDelete([...selectedPlacesToDelete, placeIndex]);
    } else {
      setSelectedPlacesToDelete(selectedPlacesToDelete.filter(idx => idx !== placeIndex));
    }
  };

  const handleBulkDelete = async () => {
    if (!onFieldChange || !formData.nearby_places || selectedPlacesToDelete.length === 0) return;

    try {
      const updatedPlaces = formData.nearby_places.filter((_, idx) => 
        !selectedPlacesToDelete.includes(idx)
      );
      
      onFieldChange('nearby_places', updatedPlaces);
      
      if (formData.id) {
        const updatedPlacesJson = preparePropertiesForJsonField(updatedPlaces);
        
        const { error } = await supabase
          .from('properties')
          .update({ 
            nearby_places: updatedPlacesJson
          })
          .eq('id', formData.id);
        
        if (error) {
          console.error("Error updating database:", error);
          throw error;
        }
      }
      
      toast({
        title: "Places removed",
        description: `${selectedPlacesToDelete.length} places have been removed.`,
      });
      
      setSelectedPlacesToDelete([]);
    } catch (error) {
      console.error("Error deleting places:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove places. Please try again.",
      });
    }
  };

  const handleFetchAllPlaces = (e: React.MouseEvent) => {
    if (!onFetchNearbyPlaces) return;
    
    e.preventDefault();
    onFetchNearbyPlaces();
  };

  return {
    nearbyPlaces,
    activeTab,
    setActiveTab,
    modalOpen,
    setModalOpen,
    currentCategory,
    placesForModal,
    isFetchingCategory,
    selectedPlacesToDelete,
    categories,
    placesByCategory,
    isLoadingNearbyPlaces,
    handleFetchCategory,
    handleSavePlaces,
    togglePlaceVisibility,
    togglePlaceSelection,
    handleBulkDelete,
    handleFetchAllPlaces
  };
}
