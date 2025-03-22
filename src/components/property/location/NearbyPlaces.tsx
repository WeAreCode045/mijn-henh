
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyNearbyPlace, PropertyCity } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, MapPin, Building } from "lucide-react";

interface NearbyPlacesProps {
  places?: PropertyNearbyPlace[];
  cities?: PropertyCity[]; 
  onRemove?: (index: number) => void;
  onFetchCategory?: (category: string) => Promise<any>;
  onFetchCities?: () => Promise<any>;
  isDisabled?: boolean;
  // Add support for the onPlaceDelete prop from PropertyLocation
  onPlaceDelete?: (e: React.MouseEvent, placeId: string) => void;
}

export function NearbyPlaces({
  places = [],
  cities = [],
  onRemove,
  onFetchCategory,
  onFetchCities,
  isDisabled = false,
  onPlaceDelete
}: NearbyPlacesProps) {
  // Group places by type
  const groupedPlaces = places.reduce((acc, place) => {
    const type = place.type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(place);
    return acc;
  }, {} as Record<string, PropertyNearbyPlace[]>);

  const placeTypes = Object.keys(groupedPlaces);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Voorzieningen in de buurt</CardTitle>
            <div className="flex gap-2">
              {onFetchCategory && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFetchCategory('all')}
                  disabled={isDisabled}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Voorzieningen Ophalen
                </Button>
              )}
              {onFetchCities && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onFetchCities}
                  disabled={isDisabled}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Steden Ophalen
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {places.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Geen voorzieningen gevonden. Klik op "Voorzieningen Ophalen" om te beginnen.
            </p>
          )}
          
          {placeTypes.map(type => (
            <div key={type} className="mb-4 last:mb-0">
              <h3 className="font-medium mb-2 capitalize">{type}</h3>
              <div className="flex flex-wrap gap-2">
                {groupedPlaces[type].map((place, index) => (
                  <Badge 
                    key={place.id} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {place.name}
                    {place.distance && (
                      <span className="text-xs opacity-70 ml-1">
                        {typeof place.distance === 'number' 
                          ? `${place.distance.toFixed(1)} km` 
                          : place.distance}
                      </span>
                    )}
                    {/* Support both onRemove and onPlaceDelete */}
                    {onRemove && !isDisabled && (
                      <button 
                        onClick={() => onRemove(index)} 
                        className="ml-1 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                    {onPlaceDelete && !isDisabled && (
                      <button 
                        onClick={(e) => onPlaceDelete(e, place.id)} 
                        className="ml-1 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          {/* Display nearby cities if available */}
          {cities && cities.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Nabijgelegen steden</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map((city, index) => (
                  <Badge 
                    key={city.id || index} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {city.name}
                    {city.distance && (
                      <span className="text-xs opacity-70 ml-1">
                        {typeof city.distance === 'number' 
                          ? `${city.distance.toFixed(1)} km` 
                          : city.distance}
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
