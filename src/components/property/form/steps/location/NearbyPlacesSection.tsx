
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { useLocationCategories } from "./useLocationCategories";
import { getCategory } from "./utils/categoryUtils";
import { CategoryFilters } from "./components/CategoryFilters";
import { CategorySection } from "./components/CategorySection";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemoveNearbyPlace?: (index: number) => void;
  onFetchLocationData?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
}

export function NearbyPlacesSection({
  formData,
  onRemoveNearbyPlace,
  onFetchLocationData,
  isLoadingLocationData = false,
  onFieldChange
}: NearbyPlacesSectionProps) {
  const nearbyPlaces = formData.nearby_places || [];
  const { showCategories, toggleCategory } = useLocationCategories();
  
  // Toggle place visibility in webview
  const togglePlaceVisibility = (placeIndex: number, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_places) return;
    
    const updatedPlaces = [...formData.nearby_places];
    updatedPlaces[placeIndex] = {
      ...updatedPlaces[placeIndex],
      visible_in_webview: visible
    };
    
    onFieldChange('nearby_places', updatedPlaces);
  };

  // Group places by category
  const groupedPlaces: Record<string, PropertyPlaceType[]> = {};
  nearbyPlaces.forEach((place) => {
    const category = getCategory(place);
    if (!groupedPlaces[category]) {
      groupedPlaces[category] = [];
    }
    groupedPlaces[category].push(place);
  });
  
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Nearby Places</Label>
            
            {onFetchLocationData && (
              <Button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  onFetchLocationData();
                }}
                className="flex items-center gap-2"
                disabled={isLoadingLocationData}
              >
                {isLoadingLocationData ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {isLoadingLocationData ? "Fetching Places..." : "Get Nearby Places"}
              </Button>
            )}
          </div>
          
          {nearbyPlaces.length > 0 ? (
            <div className="space-y-6">
              <CategoryFilters
                showCategories={showCategories}
                toggleCategory={toggleCategory}
              />
              
              {Object.keys(groupedPlaces).map((category) => (
                showCategories[category] && (
                  <CategorySection
                    key={category}
                    category={category}
                    places={groupedPlaces[category]}
                    allPlaces={nearbyPlaces}
                    onRemoveNearbyPlace={onRemoveNearbyPlace}
                    togglePlaceVisibility={togglePlaceVisibility}
                  />
                )
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No nearby places found. Use the button above to fetch places data.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
