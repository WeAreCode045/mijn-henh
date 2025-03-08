
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocationCategories } from "./useLocationCategories";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemoveNearbyPlace?: (index: number) => void;
  onFetchLocationData?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
}

const getCategoryColor = (type: string) => {
  const colors: Record<string, string> = {
    restaurant: "bg-red-100 text-red-800",
    school: "bg-blue-100 text-blue-800",
    university: "bg-indigo-100 text-indigo-800",
    hospital: "bg-green-100 text-green-800",
    store: "bg-yellow-100 text-yellow-800",
    supermarket: "bg-orange-100 text-orange-800",
    transit_station: "bg-purple-100 text-purple-800",
    bus_station: "bg-violet-100 text-violet-800",
    train_station: "bg-fuchsia-100 text-fuchsia-800",
    park: "bg-emerald-100 text-emerald-800",
    gym: "bg-pink-100 text-pink-800",
    fitness: "bg-pink-100 text-pink-800",
    sports: "bg-sky-100 text-sky-800",
    default: "bg-gray-100 text-gray-800",
  };
  
  return colors[type] || colors.default;
};

const getCategory = (place: PropertyPlaceType) => {
  const type = place.type.toLowerCase();
  
  if (type.includes('restaurant') || type.includes('cafe') || type.includes('bar') || type.includes('food')) {
    return 'restaurant';
  } else if (type.includes('school') || type.includes('education')) {
    return 'education';
  } else if (type.includes('hospital') || type.includes('doctor') || type.includes('clinic') || type.includes('health')) {
    return 'health';
  } else if (type.includes('store') || type.includes('shop') || type.includes('mall') || type.includes('supermarket')) {
    return 'shopping';
  } else if (type.includes('bus') || type.includes('train') || type.includes('transit') || type.includes('station')) {
    return 'transportation';
  } else if (type.includes('gym') || type.includes('sport') || type.includes('fitness') || type.includes('tennis') || type.includes('soccer') || type.includes('athletic')) {
    return 'sports';
  } else {
    return 'other';
  }
};

const getTransportationType = (place: PropertyPlaceType) => {
  const type = place.type.toLowerCase();
  if (type.includes('train')) {
    return 'Train';
  } else if (type.includes('bus')) {
    return 'Bus';
  } else if (type.includes('transit')) {
    return 'Transit';
  } else {
    return 'Station';
  }
};

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
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`cursor-pointer ${showCategories.education ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={(e) => toggleCategory(e, 'education')}
                >
                  Education
                </Badge>
                <Badge 
                  className={`cursor-pointer ${showCategories.sports ? 'bg-blue-500' : 'bg-gray-300'}`} 
                  onClick={(e) => toggleCategory(e, 'sports')}
                >
                  Sports
                </Badge>
                <Badge 
                  className={`cursor-pointer ${showCategories.transportation ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={(e) => toggleCategory(e, 'transportation')}
                >
                  Transportation
                </Badge>
                <Badge 
                  className={`cursor-pointer ${showCategories.shopping ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={(e) => toggleCategory(e, 'shopping')}
                >
                  Shopping
                </Badge>
                <Badge 
                  className={`cursor-pointer ${showCategories.other ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={(e) => toggleCategory(e, 'other')}
                >
                  Other
                </Badge>
              </div>
              
              {Object.keys(groupedPlaces).map((category) => (
                showCategories[category] && (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-medium capitalize">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupedPlaces[category].map((place, index) => {
                        const originalIndex = nearbyPlaces.findIndex(p => p.id === place.id);
                        return (
                          <div key={place.id || index} className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
                            <div className="flex items-start gap-2">
                              <Checkbox 
                                id={`place-${originalIndex}`}
                                checked={place.visible_in_webview !== false}
                                onCheckedChange={(checked) => {
                                  togglePlaceVisibility(originalIndex, checked === true);
                                }}
                              />
                              <div>
                                <div className="font-medium">{place.name}</div>
                                <div className="text-sm text-gray-500">{place.vicinity}</div>
                                {category === 'transportation' && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {getTransportationType(place)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {onRemoveNearbyPlace && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-full text-gray-500 hover:text-red-500"
                                onClick={() => onRemoveNearbyPlace(originalIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
