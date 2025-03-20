
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { preparePropertiesForJsonField } from "@/hooks/property-form/preparePropertyData";

export function usePlaceSelection({
  formData,
  onFieldChange
}: {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
}) {
  const [selectedPlacesToDelete, setSelectedPlacesToDelete] = useState<number[]>([]);
  const { toast } = useToast();

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

  return {
    selectedPlacesToDelete,
    togglePlaceVisibility,
    togglePlaceSelection,
    handleBulkDelete
  };
}
