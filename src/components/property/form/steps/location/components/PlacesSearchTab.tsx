
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SelectCategoryModal } from "./SelectCategoryModal";
import { Loader2 } from "lucide-react";

// Category definitions with their included types
const categoryConfig = {
  "Food & Drinks": ["restaurant", "bar", "cafe"],
  "Nightlife & Entertainment": ["casino", "concert_hall", "event_venue", "night_club", "movie_theater"],
  "Education": ["school", "university", "library", "preschool", "primary_school", "secondary_school"],
  "Sports": ["gym", "arena", "fitness_center", "golf_course", "ski_resort", "sports_club", "sports_complex", "stadium", "swimming_pool"],
  "Shopping": ["supermarket", "shopping_mall"]
};

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

  const handleSelectCategory = async (categoryName: string) => {
    console.log(`Selected category: ${categoryName}`);
    
    if (!onFetchPlaces && !onSearchClick) {
      console.error("No handler provided for fetching places");
      return;
    }

    try {
      setLocalIsLoading(true);
      console.log(`Fetching places for category: ${categoryName}`);
      
      // Get the types for this category
      const types = categoryConfig[categoryName as keyof typeof categoryConfig];
      
      if (!types || types.length === 0) {
        throw new Error(`No types found for category: ${categoryName}`);
      }
      
      if (onSearchClick) {
        // Create a synthetic mouse event to pass to onSearchClick
        const syntheticEvent = {
          preventDefault: () => {},
          stopPropagation: () => {},
          currentTarget: {} as EventTarget & HTMLButtonElement,
          target: {} as EventTarget
        } as React.MouseEvent<HTMLButtonElement>;
        
        console.log("Using onSearchClick handler");
        await onSearchClick(syntheticEvent, categoryName);
      } else if (onFetchPlaces) {
        // Use the category name to fetch (the hook will handle parsing the types)
        console.log("Using onFetchPlaces handler");
        await onFetchPlaces(categoryName);
      }
      
      // Close the modal after fetch is complete
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching places:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby places",
        variant: "destructive"
      });
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
          {combinedIsLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Find Places"
          )}
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
        onSelect={handleSelectCategory}
        isLoading={combinedIsLoading}
      />
    </div>
  );
}
