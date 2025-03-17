
import React from "react";
import { PropertyPlaceType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Star, X } from "lucide-react";

export interface PlaceItemProps {
  place: PropertyPlaceType;
  onRemove: () => void;
  onToggleVisibility: (visible: boolean) => void;
}

export function PlaceItem({ place, onRemove, onToggleVisibility }: PlaceItemProps) {
  const isVisible = place.visible_in_webview !== false;
  
  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility(!isVisible);
  };
  
  // Format distance based on unit
  const formatDistance = (distance: string | number) => {
    if (typeof distance === "number") {
      return distance < 1 ? 
        `${Math.round(distance * 1000)} m` : 
        `${distance.toFixed(1)} km`;
    }
    return distance;
  };
  
  return (
    <div className="flex items-center justify-between gap-2 p-2 border rounded-md">
      <div className="flex flex-col">
        <span className="font-medium text-sm">{place.name}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {place.rating && (
            <span className="flex items-center">
              <Star className="h-3 w-3 mr-0.5 text-yellow-500" />
              {place.rating.toFixed(1)}
            </span>
          )}
          {place.distance && (
            <span className="ml-1">
              • {formatDistance(place.distance)}
            </span>
          )}
        </div>
        <div className="flex gap-1 mt-1">
          {place.types && place.types.slice(0, 2).map((type, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {type.replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch 
          checked={isVisible} 
          onCheckedChange={(checked) => onToggleVisibility(checked)}
          className="scale-75"
        />
        
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
