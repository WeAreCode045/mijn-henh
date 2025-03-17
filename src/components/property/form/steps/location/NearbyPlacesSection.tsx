
import React from "react";
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Utensils, MapPin, Store, School, 
  Building, Hospital, Dumbbell, Ban, 
  ShoppingBag, GlassWater, ShoppingCart, Train 
} from "lucide-react";
import { CategorySection } from "./components/CategorySection";
import { PlaceItem } from "./components/PlaceItem";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchNearbyPlaces: (category: string) => Promise<void>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingNearbyPlaces: boolean;
}

export function NearbyPlacesSection({
  formData,
  onFieldChange,
  onFetchNearbyPlaces,
  onRemoveNearbyPlace,
  isLoadingNearbyPlaces
}: NearbyPlacesSectionProps) {
  const handleFetchCategory = async (category: string) => {
    try {
      await onFetchNearbyPlaces(category);
    } catch (error) {
      console.error(`Error fetching ${category} places:`, error);
    }
  };

  const handleRemovePlace = (index: number) => {
    onRemoveNearbyPlace(index);
  };

  // Simple toggle visibility function - you might want to enhance this
  const handleToggleVisibility = (index: number, visible: boolean) => {
    if (!formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces[index] = {
      ...updatedPlaces[index],
      visible_in_webview: visible
    };
    
    onFieldChange("nearby_places", updatedPlaces);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <CategorySection
            title="Restaurants"
            icon={<Utensils className="h-4 w-4" />}
            onClick={() => handleFetchCategory("restaurant")}
            isLoading={isLoadingNearbyPlaces}
          />
          
          <CategorySection
            title="Parks"
            icon={<MapPin className="h-4 w-4" />}
            onClick={() => handleFetchCategory("park")}
            isLoading={isLoadingNearbyPlaces}
          />
          
          <CategorySection
            title="Stores"
            icon={<Store className="h-4 w-4" />}
            onClick={() => handleFetchCategory("store")}
            isLoading={isLoadingNearbyPlaces}
          />
          
          <CategorySection
            title="Schools"
            icon={<School className="h-4 w-4" />}
            onClick={() => handleFetchCategory("school")}
            isLoading={isLoadingNearbyPlaces}
          />
          
          <CategorySection
            title="Supermarkets"
            icon={<ShoppingCart className="h-4 w-4" />}
            onClick={() => handleFetchCategory("supermarket")}
            isLoading={isLoadingNearbyPlaces}
          />
          
          <CategorySection
            title="Transportation"
            icon={<Train className="h-4 w-4" />}
            onClick={() => handleFetchCategory("transit_station")}
            isLoading={isLoadingNearbyPlaces}
          />
        </div>
        
        {formData.nearby_places && formData.nearby_places.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Selected Places ({formData.nearby_places.length})</h3>
            <div className="space-y-2">
              {formData.nearby_places.map((place, index) => (
                <PlaceItem
                  key={place.id || index}
                  place={place}
                  onRemove={() => handleRemovePlace(index)}
                  onToggleVisibility={(visible) => handleToggleVisibility(index, visible)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">No nearby places added yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
