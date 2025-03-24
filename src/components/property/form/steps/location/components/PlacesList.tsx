
import React from "react";
import { PropertyNearbyPlace } from "@/types/property";
import { Button } from "@/components/ui/button";
import { StarIcon, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
  isDisabled = false 
}: PlacesListProps) {
  return (
    <div className="space-y-3">
      {places.map((place, index) => (
        <Card key={place.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{place.name}</h4>
                  {onToggleVisibility && (
                    <Checkbox 
                      checked={place.visible_in_webview !== false} 
                      onCheckedChange={(checked) => 
                        onToggleVisibility(index, checked as boolean)
                      }
                      disabled={isDisabled}
                    />
                  )}
                </div>
                
                {place.vicinity && (
                  <p className="text-sm text-muted-foreground">{place.vicinity}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {place.rating && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 border-amber-200">
                      <StarIcon className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span className="text-amber-700">{place.rating.toFixed(1)}</span>
                      {place.user_ratings_total && (
                        <span className="text-amber-600 text-xs">({place.user_ratings_total})</span>
                      )}
                    </Badge>
                  )}
                  
                  <Badge variant="outline">
                    {place.type}
                  </Badge>
                </div>
              </div>
              
              {onRemove && !isDisabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
