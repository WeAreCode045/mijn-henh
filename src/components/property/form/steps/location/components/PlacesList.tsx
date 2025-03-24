
import React from "react";
import { PropertyNearbyPlace } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Eye, EyeOff } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface PlacesListProps {
  places: PropertyNearbyPlace[];
  onRemove?: (index: number) => void;
  onToggleVisibility?: (index: number, visible: boolean) => void;
  isDisabled?: boolean;
}

export function PlacesList({ 
  places, 
  onRemove,
  onToggleVisibility,
  isDisabled 
}: PlacesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {places.map((place, idx) => (
        <Card key={place.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{place.name}</h4>
                  
                  {place.rating && (
                    <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded text-xs">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                      <span>{place.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                {place.vicinity && (
                  <p className="text-xs text-muted-foreground">{place.vicinity}</p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {place.type || 'N/A'}
                  {place.distance && ` • ${typeof place.distance === 'number' 
                    ? `${place.distance.toFixed(1)} km` 
                    : place.distance}`}
                </p>
              </div>
              
              <div className="flex space-x-1">
                {onToggleVisibility && (
                  <Toggle 
                    aria-label={place.visible_in_webview ? "Hide in webview" : "Show in webview"}
                    pressed={place.visible_in_webview !== false}
                    onPressedChange={(pressed) => onToggleVisibility(idx, pressed)}
                    disabled={isDisabled}
                    size="sm"
                    className="h-8 w-8 p-0 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                  >
                    {place.visible_in_webview !== false ? 
                      <Eye className="h-4 w-4" /> : 
                      <EyeOff className="h-4 w-4" />
                    }
                  </Toggle>
                )}
                
                {onRemove && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(idx)}
                    disabled={isDisabled}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
