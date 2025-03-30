
import { useState, useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

export function usePlaceSaving({
  formData,
  onFieldChange,
  toast,
  setShowSelectionModal,
  setSearchResults
}: {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  toast: ReturnType<typeof useToast>;
  setShowSelectionModal: (value: boolean) => void;
  setSearchResults: (results: any[]) => void;
}) {
  const handleSavePlaces = useCallback(
    (selectedPlaces: any[]) => {
      if (!selectedPlaces || selectedPlaces.length === 0) {
        toast.toast({
          title: "No places selected",
          description: "Please select at least one place to save.",
          variant: "destructive",
        });
        return;
      }

      try {
        // If there are existing places, append to them
        const updatedNearbyPlaces = [
          ...(formData.nearby_places || []),
          ...selectedPlaces,
        ];

        // Update form data
        onFieldChange("nearby_places", updatedNearbyPlaces);

        // Close modal and clear search results
        setShowSelectionModal(false);
        setSearchResults([]);

        toast.toast({
          title: "Places saved",
          description: `${selectedPlaces.length} places added to nearby places.`,
        });
      } catch (error: any) {
        console.error("Error saving places:", error);
        toast.toast({
          title: "Error saving places",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    },
    [formData, onFieldChange, toast, setShowSelectionModal, setSearchResults]
  );

  return {
    handleSavePlaces,
  };
}
