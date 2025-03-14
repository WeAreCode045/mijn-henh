
import { PropertyFormData, PropertyNearbyPlace } from "@/types/property";
import { CategorySection } from "./components/CategorySection";
import { Button } from "@/components/ui/button";
import { Loader2, Navigation } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Group places by category
  const placesByCategory: Record<string, PropertyNearbyPlace[]> = {
    all: [...nearbyPlaces]
  };
  
  // Add places to their respective categories
  nearbyPlaces.forEach((place) => {
    const category = place.type || 'other';
    if (!placesByCategory[category]) {
      placesByCategory[category] = [];
    }
    // We don't modify the original place object with index property
    placesByCategory[category].push(place);
  });
  
  // Get available categories for tab list
  const categories = Object.keys(placesByCategory).filter(cat => cat !== 'all');
  
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
      
      {nearbyPlaces.length > 0 ? (
        <div className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All ({nearbyPlaces.length})</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({placesByCategory[category].length})
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-4">
              {nearbyPlaces.length > 0 ? (
                <CategorySection
                  key="all-places"
                  category="All Places"
                  places={nearbyPlaces}
                  onRemovePlace={onRemovePlace}
                  toggleVisibility={togglePlaceVisibility}
                  isVisible={(place) => !!place.visible_in_webview}
                />
              ) : (
                <p className="text-center py-4 text-muted-foreground">No places found</p>
              )}
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="space-y-4 mt-4">
                <CategorySection
                  key={category}
                  category={category.charAt(0).toUpperCase() + category.slice(1)}
                  places={placesByCategory[category]}
                  onRemovePlace={onRemovePlace}
                  toggleVisibility={togglePlaceVisibility}
                  isVisible={(place) => !!place.visible_in_webview}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            No nearby places found. Try fetching location data to discover places near this property.
          </p>
        </div>
      )}
    </div>
  );
}
