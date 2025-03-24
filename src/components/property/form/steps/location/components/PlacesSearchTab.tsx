
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { SelectCategoryModal } from "./SelectCategoryModal";
import { useToast } from "@/components/ui/use-toast";

interface PlacesSearchTabProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchPlaces?: (category: string) => Promise<any>;
  isLoading?: boolean;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

export function PlacesSearchTab({
  formData,
  onFieldChange,
  onFetchPlaces,
  isLoading = false,
  onSearchClick
}: PlacesSearchTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { toast } = useToast();

  // Combine external and local loading states
  const combinedIsLoading = isLoading || localIsLoading;

  // Reset local loading when external loading changes
  useEffect(() => {
    if (!isLoading) {
      setLocalIsLoading(false);
    }
  }, [isLoading]);

  const handleOpenModal = () => {
    // Validate that we have coordinates and property ID
    if (!formData.latitude || !formData.longitude) {
      console.error("Cannot open modal: missing coordinates");
      toast({
        title: "Error",
        description: "Property coordinates are required to search for places",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.id) {
      console.error("Cannot open modal: missing property ID");
      toast({
        title: "Error",
        description: "Please save the property first before searching for places",
        variant: "destructive"
      });
      return;
    }
    
    setShowModal(true);
  };

  const handleCategorySelect = async (category: string) => {
    console.log("PlacesSearchTab: Selected category:", category);
    
    // Validate property ID before proceeding
    if (!formData.id) {
      console.error("Cannot fetch places: Missing property ID");
      toast({
        title: "Error",
        description: "Please save the property first before searching for places",
        variant: "destructive"
      });
      return null;
    }
    
    setLocalIsLoading(true);
    
    try {
      let result = null;
      
      if (onSearchClick) {
        console.log("PlacesSearchTab: Using provided search handler for category:", category);
        // Use the parent component's click handler
        const dummyEvent = { preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent<HTMLButtonElement>;
        result = await onSearchClick(dummyEvent, category);
        console.log("PlacesSearchTab: Search handler returned result:", result);
      } else if (onFetchPlaces) {
        console.log("PlacesSearchTab: Using provided fetch handler for category:", category);
        // Use the provided fetch handler directly
        result = await onFetchPlaces(category);
        console.log("PlacesSearchTab: Fetch handler returned result:", result);
      } else {
        console.error("PlacesSearchTab: No fetch handler provided for category:", category);
        toast({
          title: "Error",
          description: "No handler available to fetch places",
          variant: "destructive"
        });
        return null;
      }
      
      if (!result || (result[category] && result[category].length === 0)) {
        console.log(`PlacesSearchTab: No places found for category: ${category}`);
        toast({
          title: "No places found",
          description: `No ${category.replace('_', ' ')} places found near this location.`,
          variant: "destructive"
        });
        return null;
      }
      
      return result;
    } catch (error) {
      console.error("PlacesSearchTab: Error fetching places:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby places",
        variant: "destructive"
      });
      return null;
    } finally {
      setLocalIsLoading(false);
    }
  };

  const hasCoordinates = !!(formData.latitude && formData.longitude);
  const hasPropertyId = !!formData.id;
  const canSearch = hasCoordinates && hasPropertyId;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Find and add places of interest near this property.
      </p>
      
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={handleOpenModal}
          disabled={combinedIsLoading || !canSearch}
        >
          {combinedIsLoading ? "Loading..." : "Find Places"}
        </Button>
      </div>
      
      {!hasCoordinates && (
        <p className="text-sm text-destructive text-center">
          Please enter property coordinates before searching for nearby places.
        </p>
      )}
      
      {!hasPropertyId && (
        <p className="text-sm text-destructive text-center">
          Please save the property first before searching for nearby places.
        </p>
      )}
      
      <SelectCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleCategorySelect}
        isLoading={combinedIsLoading}
      />
    </div>
  );
}
