
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { PlaceIcon } from "./PlaceIcon";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFetchNearbyPlaces: (category: string) => Promise<void>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingNearbyPlaces: boolean;
}

export function NearbyPlacesSection({
  formData,
  onFetchNearbyPlaces,
  onRemoveNearbyPlace,
  isLoadingNearbyPlaces
}: NearbyPlacesSectionProps) {
  // Define the categories for nearby places
  const categories = [
    { id: "restaurant", label: "Restaurants" },
    { id: "school", label: "Schools" },
    { id: "hospital", label: "Hospitals" },
    { id: "shopping", label: "Shopping" },
    { id: "transit", label: "Transit" },
    { id: "park", label: "Parks" }
  ];

  // Format distance to display with correct units
  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Handle category click without page reload
  const handleCategoryClick = (category: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onFetchNearbyPlaces(category);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
        <CardDescription>
          Add points of interest near the property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category selection buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={handleCategoryClick(category.id)}
              disabled={isLoadingNearbyPlaces}
              className="flex items-center gap-1"
            >
              <PlaceIcon type={category.id} />
              <span>{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Loading indicator */}
        {isLoadingNearbyPlaces && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Display added nearby places */}
        {formData.nearby_places && formData.nearby_places.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Added Places</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {formData.nearby_places.map((place, index) => (
                <div 
                  key={place.place_id || place.id || index} 
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <PlaceIcon type={place.type || (place.types && place.types[0]) || "default"} />
                    <div>
                      <p className="text-sm font-medium">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.vicinity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {typeof place.distance === 'number' && (
                      <Badge variant="outline">{formatDistance(place.distance)}</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveNearbyPlace(index)}
                      className="h-6 w-6"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No nearby places added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
