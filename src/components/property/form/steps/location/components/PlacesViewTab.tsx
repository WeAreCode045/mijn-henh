
import React from "react";
import { PropertyNearbyPlace } from "@/types/property/PropertyPlaceTypes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PlacesList } from "./PlacesList";
import { groupPlacesByCategory } from "../utils/placeUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlacesViewTabProps {
  places: PropertyNearbyPlace[];
  onRemove?: (index: number) => void;
  isDisabled?: boolean;
}

export function PlacesViewTab({ places, onRemove, isDisabled }: PlacesViewTabProps) {
  // Group the places by category
  const placesByCategory = React.useMemo(() => {
    // Cast to appropriate type to satisfy both type systems
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => (
        <Card key={category} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <PlacesList
              places={placesByCategory[category]}
              onRemove={onRemove}
              isDisabled={isDisabled}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
