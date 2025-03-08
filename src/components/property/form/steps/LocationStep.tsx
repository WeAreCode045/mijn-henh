
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface LocationStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  handleMapImageDelete?: () => Promise<void>;
  onAddTechnicalItem?: () => void;
  isLoadingLocationData?: boolean;
}

export function LocationStep({
  formData,
  onFieldChange,
  onFetchLocationData,
  onRemoveNearbyPlace,
  handleMapImageDelete,
  isLoadingLocationData = false
}: LocationStepProps) {
  const [showCategories, setShowCategories] = useState<{[key: string]: boolean}>({
    education: true,
    sports: true,
    transportation: true,
    shopping: true
  });

  const toggleCategory = (category: string) => {
    setShowCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group nearby places by category
  const groupedPlaces = formData.nearby_places ? 
    formData.nearby_places.reduce((acc: {[key: string]: any[]}, place) => {
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

  const nearbyCities = formData.nearby_cities || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={(e) => onFieldChange && onFieldChange("address", e.target.value)}
                placeholder="Enter full property address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location_description">Location Description</Label>
              <Textarea
                id="location_description"
                placeholder="Describe the neighborhood, amenities, and surroundings..."
                rows={4}
                value={formData.location_description || ''}
                onChange={(e) => onFieldChange && onFieldChange('location_description', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              {onFetchLocationData && (
                <Button 
                  type="button" 
                  onClick={onFetchLocationData}
                  className="flex items-center gap-2"
                  disabled={isLoadingLocationData}
                >
                  {isLoadingLocationData ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {isLoadingLocationData ? "Fetching Data..." : "Get Location Data"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {formData.map_image && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Map Preview</Label>
                {handleMapImageDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleMapImageDelete}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <img
                  src={formData.map_image}
                  alt="Property location map"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {Object.keys(groupedPlaces).length > 0 && (
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
                    onClick={() => toggleCategory(category)}
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
                                onClick={() => {
                                  const placeIndex = formData.nearby_places?.findIndex(p => 
                                    p.id === place.id || (p.name === place.name && p.vicinity === place.vicinity));
                                  if (placeIndex !== undefined && placeIndex >= 0) {
                                    onRemoveNearbyPlace(placeIndex);
                                  }
                                }}
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
      )}
      
      {nearbyCities.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label>Nearby Cities</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {nearbyCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.distance} km</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
