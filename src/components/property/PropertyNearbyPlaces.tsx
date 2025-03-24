
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyNearbyPlace } from "@/types/property/PropertyPlaceTypes";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { groupPlacesByCategory } from "./form/steps/location/utils/placeUtils";

interface PropertyNearbyPlacesProps {
  places: PropertyNearbyPlace[];
  onPlaceDelete?: (e: React.MouseEvent, id: string) => void;
}

export function PropertyNearbyPlaces({ places, onPlaceDelete }: PropertyNearbyPlacesProps) {
  if (!places || places.length === 0) return null;

  // Group the places by category
  const placesByCategory = React.useMemo(() => {
    return groupPlacesByCategory(places);
  }, [places]);

  // Get all categories from the grouped places and sort them
  const categories = Object.keys(placesByCategory).sort();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-estate-500 text-white">
        <CardTitle className="text-white">Nabijgelegen voorzieningen</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {categories.map((category) => (
          <div key={category} className="p-4 border-b last:border-b-0">
            <h3 className="font-semibold text-lg mb-3">{category}</h3>
            <div className="space-y-2">
              {placesByCategory[category].map((place) => (
                <div key={place.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{place.name}</span>
                    {place.vicinity && (
                      <p className="text-sm text-gray-500">{place.vicinity}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {place.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs">
                        <StarIcon className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{place.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {onPlaceDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => onPlaceDelete(e, place.id)}
                      >
                        &times;
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
