
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
  const groupedPlaces = useMemo(() => {
    if (!places || places.length === 0) return {};
    
    // First group by category
    const byCategory: Record<string, Record<string, PropertyNearbyPlace[]>> = {};
    
    places.forEach(place => {
      const category = place.category || 'Other';
      const type = place.type || 'other';
      
      if (!byCategory[category]) {
        byCategory[category] = {};
      }
      
      if (!byCategory[category][type]) {
        byCategory[category][type] = [];
      }
      
      byCategory[category][type].push(place);
    });
    
    return byCategory;
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
      {Object.keys(groupedPlaces).length > 0 ? (
        Object.entries(groupedPlaces).map(([category, typeGroups]) => (
          <CategoryGroup 
            key={category} 
            category={category} 
            typeGroups={typeGroups} 
            onRemovePlace={onRemovePlace} 
          />
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No nearby places found. Use the "Find Places" tab to search for places near this property.
        </div>
      )}
    </div>
  );
}

interface CategoryGroupProps {
  category: string;
  typeGroups: Record<string, PropertyNearbyPlace[]>;
  onRemovePlace: (index: number) => void;
}

function CategoryGroup({ category, typeGroups, onRemovePlace }: CategoryGroupProps) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-3 text-lg">{category}</h4>
      <div className="space-y-4">
        {Object.entries(typeGroups).map(([type, places]) => (
          <TypeGroup 
            key={type} 
            type={type} 
            places={places} 
            onRemovePlace={onRemovePlace} 
          />
        ))}
      </div>
    </div>
  );
}

interface TypeGroupProps {
  type: string;
  places: PropertyNearbyPlace[];
  onRemovePlace: (index: number) => void;
}

function TypeGroup({ type, places, onRemovePlace }: TypeGroupProps) {
  return (
    <div className="border-t pt-3">
      <h5 className="font-medium mb-2 capitalize text-sm">{type.replace('_', ' ')}</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {places.map((place, idx) => {
          // We need to find the actual index in the overall places array
          const placeId = place.id;
          return (
            <PlaceCard 
              key={placeId || idx} 
              place={place} 
              index={idx} 
              onRemove={onRemovePlace} 
            />
          );
        })}
      </div>
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
