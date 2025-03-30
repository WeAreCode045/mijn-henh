
import React from "react";
import { PropertyNearbyPlace } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { groupPlacesByCategory } from "../utils/placeUtils";

interface PlacesViewTabProps {
  places: PropertyNearbyPlace[];
  onRemove?: (index: number) => void;
}

export function PlacesViewTab({ places, onRemove }: PlacesViewTabProps) {
  // Group places by type/category
  const groupedPlaces = groupPlacesByCategory(places);
  const placeTypes = Object.keys(groupedPlaces);
  
  if (!places || places.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No nearby places found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {placeTypes.map(type => (
        <div key={type} className="space-y-2">
          <h3 className="font-medium capitalize">{type}</h3>
          <div className="flex flex-wrap gap-2">
            {groupedPlaces[type].map((place, idx) => {
              // Find the original index in the full places array for removal
              const originalIndex = places.findIndex(p => p.id === place.id);
              
              return (
                <Badge 
                  key={place.id || idx} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {place.name}
                  {place.distance && (
                    <span className="text-xs opacity-70 ml-1">
                      {typeof place.distance === 'number' 
                        ? `${place.distance.toFixed(1)} km` 
                        : place.distance}
                    </span>
                  )}
                  {onRemove && (
                    <button 
                      onClick={() => onRemove(originalIndex)}
                      className="ml-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
