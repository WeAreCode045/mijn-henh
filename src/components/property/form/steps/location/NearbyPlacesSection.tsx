
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useLocationCategories } from "./useLocationCategories";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemoveNearbyPlace?: (index: number) => void;
}

export function NearbyPlacesSection({
  formData,
  onRemoveNearbyPlace
}: NearbyPlacesSectionProps) {
  const { showCategories, toggleCategory } = useLocationCategories();

  // Group nearby places by category
  const groupedPlaces = formData.nearby_places ? 
    formData.nearby_places.reduce((acc: {[key: string]: PropertyPlaceType[]}, place) => {
      const category = place.type?.toLowerCase().includes('school') || place.type?.toLowerCase().includes('education') 
        ? 'education'
        : place.type?.toLowerCase().includes('gym') || place.type?.toLowerCase().includes('sport')
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

  if (Object.keys(groupedPlaces).length === 0) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label>Nearby Places</Label>
          
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
          
          <div className="space-y-4">
            {Object.entries(groupedPlaces).map(([category, places]) => 
              showCategories[category] && (
                <div key={category} className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-500">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <div className="space-y-2">
                    {places.map((place, index) => (
                      <div key={place.id || index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div>
                          <div className="font-medium">{place.name}</div>
                          <div className="text-sm text-gray-500">{place.vicinity}</div>
                          {place.rating && (
                            <div className="text-sm text-yellow-600">★ {place.rating} ({place.user_ratings_total || 0})</div>
                          )}
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
                            <Trash2 className="h-4 w-4" />
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
