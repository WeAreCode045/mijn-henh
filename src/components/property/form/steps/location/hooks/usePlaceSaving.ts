
import { useCallback } from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { ToastApi } from "@/components/ui/use-toast";

export function usePlaceSaving({
  formData,
  onFieldChange,
  toast,
  setShowSelectionModal,
  setSearchResults
}: {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  toast: ToastApi;
  setShowSelectionModal: (show: boolean) => void;
  setSearchResults: (results: PropertyNearbyPlace[]) => void;
}) {
  // Function to save selected places to the property
  const handleSavePlaces = useCallback((selectedPlaces: PropertyNearbyPlace[]) => {
    // Filter out duplicates based on place ID
    const existingIds = new Set((formData.nearby_places || []).map(place => place.id));
    const newPlaces = selectedPlaces.filter(place => !existingIds.has(place.id));
    
    // Combine existing and new places
    const updatedPlaces = [
      ...(formData.nearby_places || []),
      ...newPlaces
    ];
    
    // Update form data
    onFieldChange('nearby_places', updatedPlaces);
    
    // Close modal and clear results
    setShowSelectionModal(false);
    setSearchResults([]);
    
    // Show toast
    toast({
      title: "Success",
      description: `Added ${newPlaces.length} places to the property`,
    });
  }, [formData.nearby_places, onFieldChange, setSearchResults, setShowSelectionModal, toast]);

  return {
    handleSavePlaces
  };
}
