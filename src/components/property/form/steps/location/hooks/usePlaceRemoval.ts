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
  const handleRemovePlace = useCallback(
    (index: number) => {
      try {
        // If there's a custom removal handler, use it
        if (onRemoveNearbyPlace) {
          onRemoveNearbyPlace(index);
          return;
        }
        
        // Otherwise, handle removal in the hook
        const updatedPlaces = [...(formData.nearby_places || [])];
        updatedPlaces.splice(index, 1);
        
        onFieldChange("nearby_places", updatedPlaces);
        
        toast.toast({
          title: "Place removed",
          description: "The selected place has been removed from nearby places."
        });
      } catch (error: any) {
        console.error("Error removing place:", error);
        toast.toast({
          title: "Error removing place",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
      }
    },
    [formData, onFieldChange, onRemoveNearbyPlace, toast]
  );
  
  return {
    handleRemovePlace
  };
}
