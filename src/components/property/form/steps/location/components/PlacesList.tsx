
import React from "react";
import { PropertyNearbyPlace } from "@/types/property";
import { Button } from "@/components/ui/button";
import { StarIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlacesListProps {
  places: PropertyNearbyPlace[];
  onRemove?: (index: number) => void;
  isDisabled?: boolean;
}

export function PlacesList({ places, onRemove, isDisabled = false }: PlacesListProps) {
  if (!places.length) {
    return (
      <div className="py-2 text-center text-muted-foreground text-sm">
        No places in this category
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {places.map((place, index) => (
        <div 
          key={`${place.id}-${index}`}
          className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 group"
        >
          <div className="flex-1">
            <div className="font-medium">{place.name}</div>
            {place.vicinity && (
              <div className="text-xs text-muted-foreground">{place.vicinity}</div>
            )}
            <div className="flex items-center gap-1 mt-1">
              {place.rating && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <StarIcon className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span>{place.rating.toFixed(1)}</span>
                </Badge>
              )}
            </div>
          </div>
          
          {onRemove && !isDisabled && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
