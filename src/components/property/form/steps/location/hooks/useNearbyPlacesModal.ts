
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { PlaceOption } from "../components/SelectPlacesModal";

export function useNearbyPlacesModal({
  formData,
  onFieldChange,
  isReadOnly = false
}: {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  isReadOnly?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [placesForModal, setPlacesForModal] = useState<PlaceOption[]>([]);

  const handleSavePlaces = (selectedPlaces: PlaceOption[]) => {
    if (isReadOnly || !onFieldChange) return;
    
    console.log(`Saving ${selectedPlaces.length} places for category: ${currentCategory}`);
    
    // Get existing places that are not from this category
    const existingPlaces = (formData.nearby_places || []).filter(
      place => place.type !== currentCategory
    );
    
    // Combine with the new selected places
    const combinedPlaces = [
      ...existingPlaces,
      ...selectedPlaces.map(place => ({
        ...place,
        visible_in_webview: true // Set all new places to be visible by default
      }))
    ];
    
    // Update the form data
    onFieldChange('nearby_places', combinedPlaces);
    
    // Close the modal
    setModalOpen(false);
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
