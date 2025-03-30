
import { useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

export function usePlaceRemoval({
  formData,
  onFieldChange,
  onRemoveNearbyPlace,
  toast
}: {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onRemoveNearbyPlace?: (index: number) => void;
  toast: ReturnType<typeof useToast>;
}) {
  const handleRemovePlace = useCallback((index: number) => {
    if (onRemoveNearbyPlace) {
      onRemoveNearbyPlace(index);
      return;
    }
    
    if (!formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.filter((_, i) => i !== index);
    onFieldChange('nearby_places', updatedPlaces);
    
    toast.toast({
      title: "Removed",
      description: "Nearby place removed successfully",
    });
  }, [formData.nearby_places, onFieldChange, onRemoveNearbyPlace, toast]);

  return {
    handleRemovePlace
  };
}
