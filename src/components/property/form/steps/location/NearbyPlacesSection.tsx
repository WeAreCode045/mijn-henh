
import React, { useState } from "react";
import { PropertyPlaceType } from "@/types/property";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySection } from "./components/CategorySection";
import { PlaceItem } from "./components/PlaceItem";
import { RestaurantIcon, ShoppingCartIcon, SchoolIcon, HomeIcon, HeartIcon, ParkIcon } from "lucide-react";

interface NearbyPlacesSectionProps {
  formData: any;
  onRemovePlace: (index: number) => void;
  onFieldChange: (field: string, value: any) => void;
  onFetchNearbyPlaces: (category: string) => Promise<any>;
  isLoadingNearbyPlaces: boolean;
}

export function NearbyPlacesSection({
  formData,
  onRemovePlace,
  onFieldChange,
  onFetchNearbyPlaces,
  isLoadingNearbyPlaces
}: NearbyPlacesSectionProps) {
  const nearbyPlaces = formData.nearby_places || [];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleFetchRestaurants = async () => {
    setActiveCategory("restaurant");
    await onFetchNearbyPlaces("restaurant");
  };

  const handleFetchStores = async () => {
    setActiveCategory("store");
    await onFetchNearbyPlaces("store");
  };

  const handleFetchSchools = async () => {
    setActiveCategory("school");
    await onFetchNearbyPlaces("school");
  };

  const handleFetchHealthcare = async () => {
    setActiveCategory("hospital");
    await onFetchNearbyPlaces("hospital");
  };

  const handleFetchParks = async () => {
    setActiveCategory("park");
    await onFetchNearbyPlaces("park");
  };

  const handleFetchTransit = async () => {
    setActiveCategory("transit_station");
    await onFetchNearbyPlaces("transit_station");
  };

  // Helper to ensure all places have the required 'types' array
  const ensureTypesArray = (places: PropertyPlaceType[]): PropertyPlaceType[] => {
    return places.map(place => ({
      ...place,
      types: place.types || [place.type || "other"]
    }));
  };

  // Update the nearby places with visibility flag
  const updatePlaceVisibility = (placeId: string, visible: boolean) => {
    const updatedPlaces = nearbyPlaces.map((place: PropertyPlaceType) => {
      if (place.id === placeId) {
        return { ...place, visible_in_webview: visible };
      }
      return place;
    });
    onFieldChange("nearby_places", updatedPlaces);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
        <CardDescription>
          Find and add nearby places of interest that will be displayed on the property page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategorySection
            title="Restaurants"
            icon={<RestaurantIcon className="h-4 w-4" />}
            onClick={handleFetchRestaurants}
            isLoading={isLoadingNearbyPlaces && activeCategory === "restaurant"}
          />
          
          <CategorySection
            title="Shopping"
            icon={<ShoppingCartIcon className="h-4 w-4" />}
            onClick={handleFetchStores}
            isLoading={isLoadingNearbyPlaces && activeCategory === "store"}
          />
          
          <CategorySection
            title="Schools"
            icon={<SchoolIcon className="h-4 w-4" />}
            onClick={handleFetchSchools}
            isLoading={isLoadingNearbyPlaces && activeCategory === "school"}
          />
          
          <CategorySection
            title="Healthcare"
            icon={<HeartIcon className="h-4 w-4" />}
            onClick={handleFetchHealthcare}
            isLoading={isLoadingNearbyPlaces && activeCategory === "hospital"}
          />
          
          <CategorySection
            title="Parks"
            icon={<ParkIcon className="h-4 w-4" />}
            onClick={handleFetchParks}
            isLoading={isLoadingNearbyPlaces && activeCategory === "park"}
          />
          
          <CategorySection
            title="Public Transit"
            icon={<HomeIcon className="h-4 w-4" />}
            onClick={handleFetchTransit}
            isLoading={isLoadingNearbyPlaces && activeCategory === "transit_station"}
          />
        </div>

        {nearbyPlaces.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Selected Places</h3>
            <div className="space-y-3">
              {ensureTypesArray(nearbyPlaces).map((place: PropertyPlaceType, idx: number) => (
                <PlaceItem
                  key={place.id || idx}
                  place={place}
                  onRemove={() => onRemovePlace(idx)}
                  onToggleVisibility={(visible) =>
                    updatePlaceVisibility(place.id, visible)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
