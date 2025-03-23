
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NearbyPlace {
  name: string;
  vicinity?: string;
  distance?: string | number;
  types?: string[];
  icon?: string;
}

interface NearbyPlacesListProps {
  places: NearbyPlace[];
  onRemovePlace?: (index: number) => void;
}

export function NearbyPlacesList({ places, onRemovePlace }: NearbyPlacesListProps) {
  const getCategoryIcon = (types: string[] = []) => {
    // Map place types to emojis
    if (types.includes('restaurant')) return '🍽️';
    if (types.includes('cafe')) return '☕';
    if (types.includes('bar')) return '🍻';
    if (types.includes('supermarket')) return '🛒';
    if (types.includes('school')) return '🏫';
    if (types.includes('park')) return '🌳';
    if (types.includes('gym')) return '💪';
    if (types.includes('hospital')) return '🏥';
    if (types.includes('pharmacy')) return '💊';
    if (types.includes('bank')) return '🏦';
    if (types.includes('shopping_mall')) return '🛍️';
    if (types.includes('store')) return '🏪';
    if (types.includes('subway_station') || types.includes('train_station')) return '🚆';
    if (types.includes('bus_station')) return '🚌';
    return '📍';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {places.map((place, index) => (
        <Card key={index} className="relative overflow-hidden shadow-sm">
          {onRemovePlace && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-1 h-auto w-auto text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                onRemovePlace(index);
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {place.icon ? (
                  <img src={place.icon} alt="Place icon" className="w-6 h-6" />
                ) : (
                  <span>{getCategoryIcon(place.types)}</span>
                )}
              </div>
              <div>
                <h4 className="font-medium">{place.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{place.vicinity}</p>
                {place.distance && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {typeof place.distance === 'number' 
                      ? `${place.distance.toFixed(1)} km away` 
                      : place.distance}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
