
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { useLocationCategories } from "../../../form/steps/location/useLocationCategories";
import { CategoryFilters } from "./components/CategoryFilters";
import { CategorySection } from "./components/CategorySection";
import { Button } from "@/components/ui/button";
import { Loader2, Navigation } from "lucide-react";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemovePlace?: (index: number) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchNearbyPlaces?: () => Promise<void>;
  isLoadingNearbyPlaces?: boolean;
}

export function NearbyPlacesSection({ 
  formData,
  onRemovePlace,
  onFieldChange,
  onFetchNearbyPlaces,
  isLoadingNearbyPlaces = false
}: NearbyPlacesSectionProps) {
  const nearbyPlaces = formData.nearby_places || [];
  const { categories, activeFilters, handleFilterChange } = useLocationCategories(nearbyPlaces);

  // Group places by category
  const placesByCategory: Record<string, PropertyNearbyPlace[]> = {};
  
  // Initialize categories that exist in the filter list
  activeFilters.forEach(category => {
    placesByCategory[category] = [];
  });
  
  // Add places to their respective categories
  nearbyPlaces.forEach((place, index) => {
    const category = place.type || 'other';
    if (!placesByCategory[category]) {
      placesByCategory[category] = [];
    }
    // We don't modify the original place object with index property
    placesByCategory[category].push(place);
  });
  
  const togglePlaceVisibility = (placeIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.map((place, idx) => 
      idx === placeIndex ? { ...place, visible_in_webview: visible } : place
    );
    
    onFieldChange('nearby_places', updatedPlaces);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Nearby Places</h3>
        
        {onFetchNearbyPlaces && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onFetchNearbyPlaces();
            }}
            disabled={isLoadingNearbyPlaces || !formData.address}
            className="flex gap-2 items-center"
          >
            {isLoadingNearbyPlaces ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4" />
                Get Nearby Places
              </>
            )}
          </Button>
        )}
      </div>
      
      <CategoryFilters 
        categories={categories} 
        activeFilters={activeFilters} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="space-y-4 mt-4">
        {Object.entries(placesByCategory).map(([category, places]) => {
          // Only show categories that are in the active filters and have places
          if (!activeFilters.includes(category) || places.length === 0) return null;
          
          return (
            <CategorySection
              key={category}
              category={category}
              places={places}
              onRemovePlace={onRemovePlace}
              toggleVisibility={togglePlaceVisibility}
              isVisible={(place) => !!place.visible_in_webview}
            />
          );
        })}
      </div>
      
      {nearbyPlaces.length === 0 && (
        <div className="text-center py-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            No nearby places found. Try fetching location data to discover places near this property.
          </p>
        </div>
      )}
    </div>
  );
}
