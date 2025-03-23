
import { useState } from "react";
import { PropertyFormData } from "@/types/property";

export function usePlaceSelection({
  formData,
  onFieldChange,
  isReadOnly = false
}: {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  isReadOnly?: boolean;
}) {
  const [selectedPlacesToDelete, setSelectedPlacesToDelete] = useState<number[]>([]);

  const togglePlaceVisibility = (index: number, visible: boolean) => {
    if (isReadOnly || !onFieldChange) return;
    
    const places = [...(formData.nearby_places || [])];
    if (places[index]) {
      places[index] = {
        ...places[index],
        visible_in_webview: visible
      };
      onFieldChange('nearby_places', places);
    }
  };

  const togglePlaceSelection = (index: number, selected: boolean) => {
    if (isReadOnly) return;
    
    setSelectedPlacesToDelete(prevSelected => {
      if (selected) {
        return [...prevSelected, index];
      } else {
        return prevSelected.filter(i => i !== index);
      }
    });
  };

  const handleBulkDelete = () => {
    if (isReadOnly || !onFieldChange) return;
    
    if (selectedPlacesToDelete.length === 0) return;
    
    // Sort indices in descending order to remove from end first
    const sortedIndices = [...selectedPlacesToDelete].sort((a, b) => b - a);
    
    const places = [...(formData.nearby_places || [])];
    
    // Remove places at the selected indices
    sortedIndices.forEach(index => {
      places.splice(index, 1);
    });
    
    // Update form data
    onFieldChange('nearby_places', places);
    
    // Reset selection
    setSelectedPlacesToDelete([]);
  };

  return {
    selectedPlacesToDelete,
    togglePlaceVisibility,
    togglePlaceSelection,
    handleBulkDelete
  };
}
