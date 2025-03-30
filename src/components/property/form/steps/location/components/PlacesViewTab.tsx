
import React from "react";
import { PropertyNearbyPlace } from "@/types/property/PropertyPlaceTypes";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, MapPin } from "lucide-react";
import { groupPlacesByCategory } from "../utils/placeUtils";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-6">
      {placeTypes.map(type => (
        <div key={type} className="space-y-3">
          <h3 className="font-medium capitalize text-lg">{type}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupedPlaces[type].map((place, idx) => {
              // Find the original index in the full places array for removal
              const originalIndex = places.findIndex(p => p.id === place.id);
              
              return (
                <Card key={place.id || idx} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{place.name}</h4>
                        
                        {place.vicinity && (
                          <p className="text-sm text-muted-foreground">{place.vicinity}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          {place.distance && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>
                                {typeof place.distance === 'number' 
                                  ? `${place.distance.toFixed(1)} km` 
                                  : place.distance}
                              </span>
                            </Badge>
                          )}
                          
                          {place.rating && (
                            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              <span>{place.rating} 
                              {place.user_ratings_total && <span className="text-xs text-muted-foreground ml-1">({place.user_ratings_total})</span>}
                              </span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {onRemove && (
                        <button 
                          onClick={() => onRemove(originalIndex)}
                          className="p-1 hover:bg-slate-100 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
