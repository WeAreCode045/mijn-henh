
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { useCategories } from "./useCategories";
import { useNearbyPlacesModal } from "./useNearbyPlacesModal";
import { usePlaceSelection } from "./usePlaceSelection";
import { usePlaceFetching } from "./usePlaceFetching";

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
  
  // Use the dedicated categories hook
  const { categories, groupPlacesByCategory, getMaxSelections } = useCategories();
  
  // Use the modal management hook
  const { 
    modalOpen, 
    setModalOpen, 
    currentCategory, 
    setCurrentCategory, 
    placesForModal, 
    setPlacesForModal, 
    handleSavePlaces 
  } = useNearbyPlacesModal({ formData, onFieldChange });
  
  // Use the place selection hook
  const { 
    selectedPlacesToDelete, 
    togglePlaceVisibility, 
    togglePlaceSelection, 
    handleBulkDelete 
  } = usePlaceSelection({ formData, onFieldChange });
  
  // Use the place fetching hook
  const { 
    isFetchingCategory, 
    handleFetchCategory, 
    handleFetchAllPlaces 
  } = usePlaceFetching({ 
    onFetchNearbyPlaces, 
    setPlacesForModal, 
    setModalOpen, 
    setCurrentCategory,
    getMaxSelections
  });
  
  // Create the placesByCategory object using the helper from useCategories
  const placesByCategory = groupPlacesByCategory(nearbyPlaces);

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
    handleFetchAllPlaces,
    getMaxSelections
  };
}
