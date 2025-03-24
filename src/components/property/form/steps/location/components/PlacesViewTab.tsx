
import React, { useMemo } from "react";
import { PropertyNearbyPlace } from "@/types/property";
import { Loader2 } from "lucide-react";

interface PlacesViewTabProps {
  places: PropertyNearbyPlace[];
  isLoading?: boolean;
  onRemovePlace: (index: number) => void;
}

export function PlacesViewTab({ 
  places, 
  isLoading = false, 
  onRemovePlace 
}: PlacesViewTabProps) {
  // Group places by category first, then by type
  const placesByCategory = useMemo(() => {
    if (!places || places.length === 0) return {};
    
    // First group by category
    return places.reduce((acc: Record<string, PropertyNearbyPlace[]>, place) => {
      const category = place.category || place.type || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(place);
      return acc;
    }, {});
  }, [places]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading places...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.keys(placesByCategory).length > 0 ? (
        Object.entries(placesByCategory).map(([category, categoryPlaces]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-medium mb-2 capitalize">{category.replace('_', ' ')}</h3>
            
            {/* Group by types within the category */}
            <PlacesTypeGroup 
              places={categoryPlaces} 
              onRemovePlace={onRemovePlace} 
            />
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No nearby places found. Use the "Find Places" tab to search for places near this property.
        </div>
      )}
    </div>
  );
}

interface PlacesTypeGroupProps {
  places: PropertyNearbyPlace[];
  onRemovePlace: (index: number) => void;
}

function PlacesTypeGroup({ places, onRemovePlace }: PlacesTypeGroupProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {places.map((place, idx) => (
        <PlaceCard 
          key={place.id || idx} 
          place={place} 
          index={idx} 
          onRemove={onRemovePlace} 
        />
      ))}
    </div>
  );
}

interface PlaceCardProps {
  place: PropertyNearbyPlace;
  index: number;
  onRemove: (index: number) => void;
}

function PlaceCard({ place, index, onRemove }: PlaceCardProps) {
  return (
    <div className="bg-muted p-3 rounded-md relative group">
      <div className="flex justify-between items-start">
        <div>
          <h5 className="font-medium">{place.name}</h5>
          {place.vicinity && (
            <p className="text-sm text-muted-foreground">{place.vicinity}</p>
          )}
          {place.rating && (
            <p className="text-yellow-500 text-sm">★ {typeof place.rating === 'number' ? place.rating.toFixed(1) : place.rating}</p>
          )}
          {place.distance && (
            <p className="text-sm text-muted-foreground">
              Distance: {typeof place.distance === 'number' 
                ? `${place.distance.toFixed(1)} km` 
                : place.distance}
            </p>
          )}
        </div>
        <button
          type="button"
          className="h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-muted-foreground/10 absolute top-2 right-2"
          onClick={() => onRemove(index)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
