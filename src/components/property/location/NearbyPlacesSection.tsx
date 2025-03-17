
import { Card, CardContent } from "@/components/ui/card";
import { PropertyPlaceType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2, Map, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceIcon } from "./PlaceIcon";

const PLACE_CATEGORIES = [
  { name: "restaurant", label: "Restaurants" },
  { name: "school", label: "Schools" },
  { name: "supermarket", label: "Supermarkets" },
  { name: "hospital", label: "Hospitals" },
  { name: "park", label: "Parks" },
  { name: "train_station", label: "Train Stations" },
  { name: "cafe", label: "Cafés" },
  { name: "bar", label: "Bars" },
  { name: "shopping_mall", label: "Shopping" },
  { name: "gym", label: "Gyms" }
];

interface NearbyPlacesSectionProps {
  nearbyPlaces: PropertyPlaceType[];
  onFetchCategoryPlaces?: (category: string) => Promise<void>;
  onRemovePlace?: (index: number) => void;
  isLoading?: boolean;
}

export function NearbyPlacesSection({
  nearbyPlaces = [],
  onFetchCategoryPlaces,
  onRemovePlace,
  isLoading = false
}: NearbyPlacesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    
    if (onFetchCategoryPlaces) {
      setActiveCategory(category);
      onFetchCategoryPlaces(category).finally(() => {
        setActiveCategory(null);
      });
    }
  };

  const renderCategoryButtons = () => {
    return PLACE_CATEGORIES.map((category) => (
      <Button
        key={category.name}
        variant="outline"
        size="sm"
        onClick={handleCategoryClick(category.name)}
        disabled={isLoading}
        className="mb-2 mr-2"
      >
        {activeCategory === category.name ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <PlaceIcon type={category.name} className="mr-1 h-3 w-3" />
        )}
        {category.label}
      </Button>
    ));
  };

  const renderNearbyPlaces = () => {
    if (nearbyPlaces.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          <Map className="mx-auto h-8 w-8 mb-2" />
          <p>No nearby places added yet. Click on the categories above to find places.</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 mt-4">
        {nearbyPlaces.map((place, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center">
              <PlaceIcon type={place.type} className="mr-2 h-4 w-4" />
              <div>
                <p className="font-medium">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.vicinity}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">
                {Math.round(place.distance * 10) / 10} km
              </Badge>
              {onRemovePlace && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemovePlace(index)}
                  className="h-7 w-7 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Nearby Places</h3>
          </div>
          
          <div className="flex flex-wrap">{renderCategoryButtons()}</div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            renderNearbyPlaces()
          )}
        </div>
      </CardContent>
    </Card>
  );
}
