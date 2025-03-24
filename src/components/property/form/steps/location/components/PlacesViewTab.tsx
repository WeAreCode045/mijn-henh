
import React from "react";
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PlacesList } from "./PlacesList";
import { groupPlacesByCategory } from "../utils/placeUtils";

interface PlacesViewTabProps {
  places: PropertyNearbyPlace[];
  onRemove?: (index: number) => void;
  isDisabled?: boolean;
}

export function PlacesViewTab({ places, onRemove, isDisabled }: PlacesViewTabProps) {
  // Group the places by category
  const placesByCategory = React.useMemo(() => {
    return groupPlacesByCategory(places);
  }, [places]);

  // Get all categories from the grouped places
  const categories = Object.keys(placesByCategory);

  if (places.length === 0) {
    return (
      <Alert variant="default" className="bg-gray-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No places have been saved to this property. Use the "Search" tab to find and save nearby places.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-semibold">{category}</h3>
          <PlacesList
            places={placesByCategory[category]}
            onRemove={onRemove}
            isDisabled={isDisabled}
          />
        </div>
      ))}
    </div>
  );
}
