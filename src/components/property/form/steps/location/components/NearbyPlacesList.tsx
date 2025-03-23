
import React from "react";
import { PropertyNearbyPlace } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NearbyPlacesListProps {
  places: PropertyNearbyPlace[];
  onRemove: (index: number) => void;
}

export function NearbyPlacesList({ places, onRemove }: NearbyPlacesListProps) {
  if (!places.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No nearby places found. Use the "Find Places" tab to search for places near this property.
      </div>
    );
  }
  
  // Add index to each place for removal
  const placesWithIndex = places.map((place, index) => ({
    ...place,
    index
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {placesWithIndex.map((place) => (
          <div 
            key={`${place.name}-${place.index}`}
            className="border rounded-md p-3 bg-card relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{place.name}</h4>
                <p className="text-sm text-muted-foreground">{place.vicinity}</p>
                {place.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm">{place.rating} ({place.user_ratings_total || 0})</span>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(place.index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
