
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyNearbyPlace } from "@/types/property";
import { Trash2 } from "lucide-react";

interface NearbyPlacesListProps {
  places: PropertyNearbyPlace[];
  onRemovePlace?: (index: number) => void;
}

export function NearbyPlacesList({ places, onRemovePlace }: NearbyPlacesListProps) {
  // Group places by type
  const groupedPlaces = places.reduce((acc: Record<string, PropertyNearbyPlace[]>, place, index) => {
    const type = place.type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    // Add the index to each place to help with removal
    acc[type].push({ ...place, index });
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedPlaces).map(([type, placesOfType]) => (
        <Card key={type}>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2 capitalize">{type.replace('_', ' ')}</h4>
            <div className="flex flex-wrap gap-2">
              {placesOfType.map((place, categoryIndex) => (
                <Badge 
                  key={`${place.id || categoryIndex}`} 
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  <span>{place.name}</span>
                  {place.distance && (
                    <span className="text-xs opacity-70 ml-1">
                      {typeof place.distance === 'number' 
                        ? `${place.distance.toFixed(1)} km` 
                        : place.distance}
                    </span>
                  )}
                  {onRemovePlace && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        e.stopPropagation(); // Prevent event bubbling
                        if (onRemovePlace && typeof place.index === 'number') {
                          onRemovePlace(place.index);
                        }
                      }}
                      className="ml-1 p-1 rounded-full hover:bg-muted hover:text-destructive"
                      type="button" // Explicitly set as button type
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
