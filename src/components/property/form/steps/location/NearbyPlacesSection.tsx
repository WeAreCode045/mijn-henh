
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Loader2, Check } from "lucide-react";
import { useLocationCategories } from "./useLocationCategories";
import { Checkbox } from "@/components/ui/checkbox";

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
  const { showCategories, toggleCategory } = useLocationCategories();

  // Group nearby places by category with improved categorization
  const groupedPlaces = formData.nearby_places ? 
    formData.nearby_places.reduce((acc: {[key: string]: PropertyPlaceType[]}, place) => {
      const category = place.type?.toLowerCase().includes('school') || place.type?.toLowerCase().includes('education') 
        ? 'education'
        : place.type?.toLowerCase().includes('gym') || place.type?.toLowerCase().includes('sport') || 
          place.type?.toLowerCase().includes('fitness') || place.type?.toLowerCase().includes('tennis') || 
          place.type?.toLowerCase().includes('soccer')
        ? 'sports'
        : place.type?.toLowerCase().includes('transit') || place.type?.toLowerCase().includes('station') || place.type?.toLowerCase().includes('bus')
        ? 'transportation'
        : place.type?.toLowerCase().includes('store') || place.type?.toLowerCase().includes('supermarket') || place.type?.toLowerCase().includes('mall')
        ? 'shopping'
        : 'other';
      
      if (!acc[category]) acc[category] = [];
      acc[category].push(place);
      return acc;
    }, {}) 
    : {};

  // Format transportation type
  const getTransportType = (place: PropertyPlaceType) => {
    if (place.type?.toLowerCase().includes('train') || place.type?.toLowerCase().includes('rail')) {
      return 'Train';
    } else if (place.type?.toLowerCase().includes('bus')) {
      return 'Bus';
    } else {
      return 'Transit';
    }
  };

  // Toggle place visibility in webview
  const togglePlaceVisibility = (place: PropertyPlaceType, visible: boolean) => {
    if (!onFieldChange || !formData.nearby_places) return;
    
    const updatedPlaces = formData.nearby_places.map(p => {
      if (p.id === place.id) {
        return { ...p, visible_in_webview: visible };
      }
      return p;
    });
    
    onFieldChange('nearby_places', updatedPlaces);
  };

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
          
          {Object.keys(groupedPlaces).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(groupedPlaces).map(category => (
                <Button
                  key={category}
                  variant={showCategories[category] ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => toggleCategory(e, category)}
                  type="button"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          )}
          
          <div className="space-y-6">
            {Object.entries(groupedPlaces).map(([category, places]) => 
              showCategories[category] && (
                <div key={category} className="space-y-2">
                  <h3 className="font-medium text-base capitalize">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {places.map((place, index) => (
                      <div key={place.id || index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <Checkbox 
                            id={`place-${place.id || index}`}
                            checked={place.visible_in_webview !== false}
                            onCheckedChange={(checked) => {
                              togglePlaceVisibility(place, checked === true);
                            }}
                          />
                          <div>
                            <div className="font-medium">{place.name}</div>
                            <div className="text-sm text-gray-500">{place.vicinity}</div>
                            {category === 'transportation' && (
                              <div className="text-sm font-medium text-blue-600">{getTransportType(place)}</div>
                            )}
                            {place.rating && (
                              <div className="text-sm text-yellow-600">★ {place.rating} ({place.user_ratings_total || 0})</div>
                            )}
                          </div>
                        </div>
                        
                        {onRemoveNearbyPlace && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.preventDefault();
                              const placeIndex = formData.nearby_places?.findIndex(p => 
                                p.id === place.id || (p.name === place.name && p.vicinity === place.vicinity));
                              if (placeIndex !== undefined && placeIndex >= 0) {
                                onRemoveNearbyPlace(placeIndex);
                              }
                            }}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
